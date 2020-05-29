const { File } = require('@keystonejs/fields');
const { LocalFileAdapter } = require('@keystonejs/file-adapters');

const fileAdapter = new LocalFileAdapter({
   src: './files', // The path where uploaded files will be stored on the server.
   path: '/files', // The path from which requests for files will be served from the server. 
   // WHAT are these?
  });
  

module.exports = {fields: {
    file: {
      type: File,
      adapter: fileAdapter,
      isRequired: true,
    },
  }
}