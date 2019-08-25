const { Storage } = require('@google-cloud/storage');
const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = '.'+process.env.GOOGLE_CLOUD_KEYFILE; // Replace with the path to the downloaded private key
module.exports = {
  storage: new Storage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
  }),
  getPublicUrl: (bucketName, fileName) => `https://storage.googleapis.com/${bucketName}/${fileName}`,

  copyFileToGCS: (localFilePath, bucketName, options) => {
    options = options || {};

    const bucket = this.storage.bucket(bucketName);
    const fileName = path.basename(localFilePath);
    const file = bucket.file(fileName);

    return bucket.upload(localFilePath, options)
      .then(() => file.makePublic())
      .then(() => exports.getPublicUrl(bucketName, gcsName));
  },
}; 