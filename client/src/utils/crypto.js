import tripledes from 'crypto-js/tripledes';
import utf8 from 'crypto-js/enc-utf8';

const encrypt = (data,key) => {
    return tripledes.encrypt(JSON.stringify(data), key).toString();
}

const decrypt = (data,key) => {
    let bytes  = tripledes.decrypt(data, key);
    return JSON.parse(bytes.toString(utf8));
}

export {encrypt, decrypt};