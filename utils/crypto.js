var CryptoJS = require("crypto-js");

module.exports = function(key) {
    const SECRET_KEY = key;

    return {
        encrypt: function(data, isObj = true) {
            if(data === '') return data;
            let plain = isObj ? JSON.stringify(data) : data;
            return CryptoJS.TripleDES.encrypt(plain, SECRET_KEY).toString();
        },
        decrypt: function(data, isObj = true) {
            if(data === '') return data;
            let plainBytes  = CryptoJS.TripleDES.decrypt(data, SECRET_KEY);
            let plainStr = plainBytes.toString(CryptoJS.enc.Utf8);
            return isObj ? JSON.parse(plainStr) : plainStr;
        }
    }
}