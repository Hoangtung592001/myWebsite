const express = require('express');
const router = express.Router();

const SiteController = require('../app/controllers/SiteController');

// router.post('/:productCode/comment', isLoggedIn, buyingController.comment);

router.get('/', SiteController.home);

router.post('/signup', SiteController.signup);

router.post('/login', SiteController.login);

module.exports = router;
