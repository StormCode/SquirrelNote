const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){
    //從header取得token
    const token = req.header('x-auth-token');

    //檢查token是否存在
    if(!token){
        return res.status(400).json({msg: 'token無效，驗證失敗'});
    }

    try {
        //驗證token
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;

        next();
    }
    catch(err){
        res.status(401).json({msg: 'JSON格式不正確'});
    }
}