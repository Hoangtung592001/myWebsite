const express = require('express');
const isLoggedIn = require('../app/middlewares/isLogged_in');
const router = express.Router();

const buyingController = require('../app/controllers/BuyingController');

router.get('/:productCode', isLoggedIn, buyingController.purchase);

router.post('/add_to_cart/:productCode', isLoggedIn, buyingController.add_to_cart);

module.exports = router;
