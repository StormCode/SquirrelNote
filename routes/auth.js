const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { 
    INVALID_CREDENTIALS,
    NOT_AUTHORIZED
} = require('../status');

const User = require('../models/User');
const auth = require('../middleware/auth');

// @route           GET /api/auth
// @desc            取得使用者資訊
// @access          Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route           POST /api/auth
// @desc            驗證使用者 & 取得token
// @access          Public
router.post('/', [
    check('email', '請輸入有效的email').isEmail(),
    check('password','必須輸入密碼').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({status: INVALID_CREDENTIALS});
        }
        else if(user.status !== 1) {
            return res.status(400).json({status: NOT_AUTHORIZED});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({status: INVALID_CREDENTIALS});
        }

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
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route           GET /api/auth/authUser/:token
// @desc            啟用帳號
// @access          Public
router.get('/authUser/:token', async (req, res) => {
    try{
        let user = await User.findOne({activeToken: req.params.token, activeExpires: {$gt: Date.now()}});

        if(!user) {
            return res.status(400).json({status: INVALID_CREDENTIALS});
        }

        // 更改使用者的狀態為啟用
        await User.findByIdAndUpdate(user._id,
            { $set: {'status': 1 }, $unset: {
                    'activeToken': 1,
                    'activeExpires': 1
                }
            },
            { new: true });

        return res.status(200).send();
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route           GET /api/auth/resetPassword/:token
// @desc            驗證重設密碼連結
// @access          Public
router.get('/resetPassword/:token', async (req, res) => {
    try{
        let user = await User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}});

        if(!user) {
            return res.status(400).json({status: INVALID_CREDENTIALS});
        }

        return res.status(200).send();
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;