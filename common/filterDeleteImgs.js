const DomParser = require('dom-parser');

function ImgSrcParser(content) {
    return Array.from( new DomParser().parseFromString( content, 'text/html' )
    .getElementsByTagName( 'img' ) )
    .map(img => img.getAttribute('src'));
}

//比對originalContent及currentContent，回傳不存在於currentContent的圖片檔名
//若不傳入currentContent，則回傳originalContent全部的圖片檔名
module.exports = function(originalContent, currentContent) {
    let res;
    //抓出原始(未修改)筆記內容所有的img src
    let originalImgSrcArr = ImgSrcParser(originalContent);

    if(typeof currentContent !== 'undefined'){
        
        //抓出目前筆記內容所有的img src
        let currentImgSrcArr = ImgSrcParser(currentContent);
        
        //兩兩比對抓出被刪掉的圖片檔名
        res = originalImgSrcArr.filter(src => currentImgSrcArr.indexOf(src) === -1)
            .map(src => src.split('/').slice(-1)[0]);
    } else {
        //抓出檔名
        res = originalImgSrcArr.map(src => src.split('/').slice(-1)[0]);
    }

    return res;
}