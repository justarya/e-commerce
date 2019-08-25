const router = require('express').Router();
const cart = require('../controllers/cart');
const authentication = require('../middlewares/authentication')
const authorization = require('../middlewares/authorization')

router.use(authentication);

router.get('/', cart.find)
router.get('/history', cart.history);
router.get('/checkout', cart.showCheckout);

router.post('/', cart.create);
router.patch('/:id', authorization.cart, cart.update);
router.patch('/:id/checkout', authorization.cart, cart.checkout);

router.patch('/:id/payment', authorization.cart, cart.payment);

router.delete('/:id', authorization.cart, cart.remove);

module.exports = router;