const ImgSrcParser = content => {
    return Array.from( new DOMParser().parseFromString( content, 'text/html' )
    .querySelectorAll( 'img' ) )
    .map(img => img.getAttribute('src'));
}

export default ImgSrcParser;