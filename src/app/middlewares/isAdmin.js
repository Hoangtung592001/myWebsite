const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../models/Site');

module.exports = function(req, res, next) {
    const user = req.user;
    if (user.role !== 'admin') {
        
        res.send("Bạn không có quyền truy cập miền này");
    }
    else {
        
        next();
    }
}