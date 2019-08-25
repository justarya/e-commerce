const multer = require('multer');

const storage = multer.MemoryStorage;

const limit = {
  fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
};

const fileFilter = function(req, file, cb){
  if(!file){
    cb();
  }
  const image = file.mimetype.startsWith('image/');
  if(image){
    cb(null,true);
  }else{      
    cb({httpStatus: 415, message: 'File is not supported'},false);
  }
}

 
const upload = multer({ storage, fileFilter, limit }).single('photo');

module.exports = function(req,res,next){
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      next(err);
    } else if (err) {
      next(err);
    }
    // Everything went fine.
    next();
  })
}