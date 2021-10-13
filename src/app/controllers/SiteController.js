const db = require('../models/Site');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const paginating = require('../function/pagination');


// const mysql = require('mysql');
// const db = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '0865783836',
//     database : 'sellingwebsite'
// });
db.connect();

class SiteController {
    // [GET] /
    index(req, res, next) {
        // req, res, next, sql, home
        let sql = 'SELECT * FROM products JOIN shoptype on products.shopTypeID = shoptype.shopTypeID';
        paginating(req, res, next, sql, 'home', '/');
    }

    signup(req, res, next) {
        const sqlFind = "SELECT * FROM users";
        db.query(sqlFind, function (err, users) {
            users.forEach(function (user) {
                if (user.username === req.body.username) {
                    res.send("Tài khoản đã có người sử dụng");
                    return;
                }
            })
        })
        const sqlInsert = `INSERT INTO users VALUES((select MAX(userId) from users as b) + 1, "${req.body.username}", "${req.body.password}", "${req.body.nameWeb}", "user");`
        db.query(sqlInsert, function(err, products) {
            if (err) throw err;
            res.redirect('/');
        })
    }

    login(req, res, next) {
        const sqlFind = "SELECT * FROM users";
        var isLoggedIn = false;
        db.query(sqlFind, function (err, users) {
            users.forEach(function (user) {
                if (user.username === req.body.username && user.password === req.body.password) {
                    // res.send(req.cookies.myOrders);
                    // res.json({ reqq: res.locals });
                    const data = req.body;
                    var myOrder;
                    data.name = user.name;
                    data.role = user.role;
                    data.userId = user.userId;
                    const accessToken = jwt.sign(data, "ANHYEUEM");
                    res.cookie('token', accessToken);
                    res.redirect('/');
                    isLoggedIn = true;
                }
            })

        });

    }

}


module.exports = new SiteController();
