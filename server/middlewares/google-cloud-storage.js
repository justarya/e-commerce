const gcsHelpers = require('../helpers/google-cloud-storage');
	
const { storage } = gcsHelpers;
const DEFAULT_BUCKET_NAME = process.env.DEFAULT_BUCKET_NAME; // Replace with the name of your bucket

exports.sendUploadToGCS = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const bucketName = req.body.bucketName || DEFAULT_BUCKET_NAME;
  const bucket = storage.bucket(bucketName);

  const gcsFileName = `${Date.now()}-${req.file.originalname}`;

  const file = bucket.file(gcsFileName);
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });
  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });
  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsFileName;
    return file.makePublic()
      .then(() => {
        req.file.gcsUrl = gcsHelpers.getPublicUrl(bucketName, gcsFileName);
        next();
      });
  });
  stream.end(req.file.buffer);
};