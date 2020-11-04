export default class UploadAdapter {
    constructor( loader) {
      // The FileLoader instance to use during the upload. It sounds scary but do not
      // worry — the loader will be passed into the adapter later on in this guide.
      this.loader = loader;
    }
  
    // Starts the upload process.
    upload() {
      return this.loader.file.then(
        file => 
          new Promise(( resolve ) => {
            resolve({
              default: window.URL.createObjectURL(file)
            });
          })
      );
    }
  
    // Aborts the upload process.
    abort() {
    }
  
    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest() {
    }
  
    // Initializes XMLHttpRequest listeners.
    _initListeners() {
    }
  
    // Prepares the data and sends the request.
    _sendRequest() {
    }
  }