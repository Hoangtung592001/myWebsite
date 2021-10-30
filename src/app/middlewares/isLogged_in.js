const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../models/Site');

module.exports = function(req, res, next) {
    // localStorage.setItem('ordercart', "1");
    const accessToken = req.cookies.token;

    if (!accessToken) {
        res.locals.access = false;
        // res.send('Bạn chưa đăng nhập!');
    }
    else {
        res.locals.access = true;
        // res.locals.productsInCart = req.cookies.productsInCart;
        
        jwt.verify(accessToken, "ANHYEUEM", function(err, user) {
            res.locals.name = user.name;
            req.user = user;
        })
    }
    next();
    
}
