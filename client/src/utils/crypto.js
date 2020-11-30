import tripledes from 'crypto-js/tripledes';
import utf8 from 'crypto-js/enc-utf8';

const encrypt = (data, key, isObj = true) => {
    if(data === '') return data;
    let plain = isObj ? JSON.stringify(data) : data;
    return tripledes.encrypt(plain, key).toString();
}

const decrypt = (data, key, isObj = true) => {
    if(data === '') return data;
    let plainBytes  = tripledes.decrypt(data, key);
    let plainStr = plainBytes.toString(utf8);
    return isObj ? JSON.parse(plainStr) : plainStr;
}

export {encrypt, decrypt};