const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const url = require('url');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const {
    DUPLICATED_USER,
    NOTEXIST_USER
} = require('../status');

const User = require('../models/User');

const logoLink = process.env.LOGO_URL;
const brandLink = process.env.BRAND_URL;
const backgroundLink = process.env.MAIL_BACKGROUND_URL;

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
            return res.status(400).json({status: DUPLICATED_USER});
        }

        user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        
        // 產生驗證帳號連結
        let token = await bcrypt.hash(email, salt);
        token = token.replace(/\//g,'');    //把斜線去掉
        const baseUrl = `${req.protocol}://${url.parse(req.get('origin'), false, true).hostname}:${process.env.PROXY_PORT}`;
        const authUserLink = `${baseUrl}/AuthUser/${token}`;
        
        // 將token存到該名使用者document
        user.activeToken = token;
        user.activeExpires = Date.now() + 3600000;

        await user.save();

        //
        // 寄發帳號啟用信至mail
        //
        
        let title = '松鼠筆記-帳號啟用信件';
        let content = `<div class='container' 
                            style='text-align: center;
                            border-radius: 20px;
                            background: url("${backgroundLink}");
                            background-size: 100% 100%;
                            padding: 50px;
                            width: 100%;
                            height: 100%;'>
            <img src='${logoLink}' />&nbsp;<img src='${brandLink}' />
            <br /><br /><h2 style='text-align: left;'>${user.name} 您好,</h2><br />
            <p style='text-align: left;'>感謝您使用松鼠筆記，請點擊以下連結啟用您的帳號：</p>
            <p style='text-align: left;'><a href='${authUserLink}'>${authUserLink}</a></p>
            <br /><br /><p style='text-align: left;'>希望您使用愉快~</p><p style='text-align: right;'>松鼠筆記 敬上</p>
            </div>`;
        
        let mailSender = require('../utils/email.js')({
            username: process.env.GMAIL_USERNAME,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN
        });

        mailSender.send(email,title,content);

        // 產生驗證身份的token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWTSECRET,{
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
            return res.status(400).json({status: NOTEXIST_USER});
        }

        // 產生重設密碼連結
        const salt = await bcrypt.genSalt(10);
        let token = await bcrypt.hash(email, salt);
        token = token.replace(/\//g,'');    //把斜線去掉
        const baseUrl = `${req.protocol}://${url.parse(req.get('origin'), false, true).hostname}:${process.env.PROXY_PORT}`;
        const resetPwdLink = `${baseUrl}/ResetPassword/${token}`;
        
        // 將token存到該名使用者document
        await User.findByIdAndUpdate(user._id,
            { $set: {'resetPasswordToken': token, 'resetPasswordExpires': Date.now() + 3600000 }},
            { new: true });

        //
        // 寄發重設密碼信至mail
        //
        
        let title = '松鼠筆記-重設密碼信件';
        let content = `<div class='container' 
                            style='text-align: center;
                            border-radius: 20px;
                            background: url("${backgroundLink}");
                            background-size: 100% 100%;
                            padding: 50px;
                            width: 100%;
                            height: 100%;'>
                        <img src='${logoLink}' />&nbsp;<img src='${brandLink}' />
                        <br /><br /><h2 style='text-align: left;'>${user.name} 您好,</h2><br />
                        <p style='text-align: left;'>您收到這封信件是因為您(或他人)對您的帳號做了重設密碼的操作，若非您本人的意願，請忽略這封信件；若您想重設密碼請點擊以下連結：</p>
                        <p style='text-align: left;'><a href='${resetPwdLink}'>${resetPwdLink}</a></p>
                        </div>`;
        
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
        check('password', '請輸入6位以上的字元、數字或符號')
            .isLength({ min: 6 })
    ], async (req, res) => {
    try{
        const {token, password} = req.body;

        let user = await User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}});

        if(!user) {
            return res.status(400).json({status: INVALID_CREDENTIALS});
        }
        
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        await User.findByIdAndUpdate(user._id,
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