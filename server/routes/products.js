const router = require('express').Router();
const product = require('../controllers/product');
const authentication = require('../middlewares/authentication')
const authorization = require('../middlewares/authorization')
const upload = require('../middlewares/upload')
const gcs = require('../middlewares/google-cloud-storage')

router.get('/', product.findAll);
router.get('/:id', product.findOne);
// router.use('/', () => console.log('-------------------------------------------'))

router.use(authentication);
router.post('/', upload, gcs.sendUploadToGCS, product.create);

router.put('/:id', authorization.product, product.edit);
router.delete('/:id', authorization.product, product.remove);


module.exports = router;