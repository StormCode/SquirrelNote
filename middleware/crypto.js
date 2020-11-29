const crypto = require('../utils/crypto');

module.exports = function(req, res, next){
    try {
        console.log(req.body);
        
        // 解密資料
        req.body = crypto(process.env.SECRET_KEY).decrypt(req.body);

        next();
    }
    catch(err){
        res.status(500).json({msg: '解密過程中發生異常'});
    }
}