var CryptoJS = require("crypto-js");

module.exports = function(key) {
    const SECRET_KEY = key;

    return {
        encrypt: function(data) {
            return CryptoJS.TripleDES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
        },
        decrypt: function(data) {
            let bytes  = CryptoJS.TripleDES.decrypt(data, SECRET_KEY);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
    }
}