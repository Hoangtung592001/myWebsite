const db = require('../models/Me');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

module.exports = function(req, res, next) {
    const accessToken = req.cookies.token;
    if (!accessToken) {
        res.json({ name: "Đăng nhập thất bại" });
    }
    const decoded = jwt.verify(token, "ANHYEUEM");
    req.user = decoded.username;
}