const express = require('express');
const isLoggedIn = require('../app/middlewares/isLogged_in');
const isAdmin = require('../app/middlewares/isAdmin');
const router = express.Router();

const meController = require('../app/controllers/MeController');

router.get('/order', isLoggedIn, meController.order);

router.get('/myInfo', isLoggedIn, meController.myInfo);

router.get('/sale', isLoggedIn, meController.sale);

router.get('/logout', meController.logout);

router.get('/user_list', isLoggedIn, isAdmin, meController.user_list);

router.post('/post_for_sale', isLoggedIn, meController.post_for_sale)

router.get('/store', isLoggedIn, meController.store);


module.exports = router;
