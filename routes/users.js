const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();
const url = require('url');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const {
    DUPLICATED_USER,
    NOTEXIST_USER
} = require('../status');

const User = require('../models/User');

// @route           POST /api/users
// @desc            註冊帳號
// @access          Public
router.post('/', [
    check('name', '請輸入姓名')
        .not()
        .isEmpty(),
    check('email', '請輸入有效的email')
        .isEmail(),
    check('password', '請輸入6位以上的字元、數字或符號')
        .isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try{
        let user = await User.findOne({email});

        if(user) {
            return res.status(400).json({msg: '您的email已經被註冊過', status: DUPLICATED_USER});
        }

        user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.get('jwtSecret'),{
            expiresIn: 360000
        },(err, token) => {
            if(err) throw err;
            res.json({token});
        });
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route           POST /api/users/forgotPassword
// @desc            忘記密碼，寄重設密碼信
// @access          Public
router.post('/forgotPassword', [
    check('email', '請輸入有效的email')
        .isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try{
        let user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({msg: '您輸入的email不存在', status: NOTEXIST_USER});
        }

        // 產生重設密碼連結
        const salt = await bcrypt.genSalt(10);
        let token = await bcrypt.hash(email, salt);
        token = token.replace(/\//,'');    //把斜線去掉
        let resetPwdLink = `${req.protocol}://${url.parse(req.get('origin'), false, true).hostname}:${process.env.PROXY_PORT}/ResetPassword/${token}`;
        
        // 將token存到該名使用者document
        await User.findByIdAndUpdate(user._id,
            { $set: {'resetPasswordToken': token, 'resetPasswordExpires': Date.now() + 3600000 }},
            { new: true });

        //
        // 寄發重設密碼信至mail
        //
        
        let title = '松鼠筆記-重設密碼信件';
        let content = `<h2>${user.name} 您好,</h2><br />您收到這封信件是因為您(或他人)對您的帳號做了重設密碼的操作，若非您本人的意願，請忽略這封信件；若您想重設密碼請點擊以下連結：<br />${resetPwdLink}`;
        
        let mailSender = require('../utils/email.js')({
            username: process.env.GMAIL_USERNAME,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN
        });

        mailSender.send(email,title,content);

        res.status(200).send();
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route           POST /api/users/resetPassword
// @desc            重設密碼
// @access          Public
router.post('/resetPassword', [
        check('email', '請輸入有效的email')
            .isEmail(),
        check('password', '請輸入6位以上的字元、數字或符號')
            .isLength({ min: 6 })
    ], async (req, res) => {
    try{
        const {email, password} = req.body;

        let user = await User.findOne({email: email, resetPasswordExpires: {$gt: Date.now()}});

        if(!user) {
            return res.status(400).json({msg: '您的重設密碼連結無效或已過期', status: INVALID_CREDENTIALS});
        }
        
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        await User.findOneAndUpdate({},
            { $unset: {
                    'resetPasswordToken': 1,
                    'resetPasswordExpires': 1
                }
            });

        res.status(200).send();
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;