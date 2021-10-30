const express = require('express');
const isLoggedIn = require('../app/middlewares/isLogged_in');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.post('/signup', siteController.signup);

router.post('/isLoginTrue', siteController.isLoginTrue);

router.post('/login', siteController.login);

router.get('/', isLoggedIn, siteController.index);



module.exports = router;
