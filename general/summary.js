const DomParser = require('dom-parser');

module.exports = function(data) {
    let dom = new DomParser().parseFromString( data, 'text/html' );
    let elements = dom.getElementsByTagName( 'p' )
        || dom.getElementsByTagName( 'h1' )
        || dom.getElementsByTagName( 'h2' )
        || dom.getElementsByTagName( 'h3' )
        || dom.getElementsByTagName( 'blockquote' )
        || dom.getElementsByTagName( 'q' )
        || dom.getElementsByTagName( 'cite' )
        || dom.getElementsByTagName( 'code' );
    return elements[0] ? elements[0].textContent
    .replace(/&nbsp;/g, '')
    .substring(0,10) : '';
}