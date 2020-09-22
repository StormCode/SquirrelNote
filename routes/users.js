const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();
const { check, validationResult } = require('express-validator');

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
            return res.status(400).json({msg: '您的email已經被註冊過'});
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

module.exports = router;