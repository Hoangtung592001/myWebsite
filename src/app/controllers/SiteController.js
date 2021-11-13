const db = require('../models/Site');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const paginating = require('../function/pagination');

db.connect();

class SiteController {
    // [GET] /
    index(req, res, next) {
        // req, res, next, sql, home
        if (req.query.hasOwnProperty('sort')) {
            const condition = req.query.field;
            const type = req.query.type;
            let sql = `SELECT * FROM products JOIN shoptype on products.shopTypeID = shoptype.shopTypeID` +
            ` ORDER BY ${condition} ${type}`;
            db.query(sql, (err, products) => {
                res.render('home', {products});
            })
        }
        else if (req.query.hasOwnProperty('productline')) {
            const condition = req.query.type;
            let sql = `SELECT * FROM products JOIN shoptype on products.shopTypeID = shoptype.shopTypeID` +
            ` WHERE productline = "${condition}"`;
            db.query(sql, (err, products) => {
                res.render('home', {products});
            })
        }
        else {
            let sql = 'SELECT * FROM products JOIN shoptype on products.shopTypeID = shoptype.shopTypeID';
            paginating(req, res, next, sql, 'home', '/');
        }
    }

    sort(req, res, next) {
        res.render('home');
    }

    signup(req, res, next) {
        const sqlFind = `SELECT * FROM users WHERE username = "${req.body.username}"`;
        db.query(sqlFind, function (err, users) {
            users = Array.from(users)[0];
            if (users) {
                res.status(404).send('Tài khoản đã có người sử dụng!');
                return;
            }
            else {
                const sqlInsert = `INSERT INTO users VALUES((select MAX(userId) from users as b) + 1, "${req.body.username}", "${req.body.password}", "${req.body.nameWeb}", "user");`
                db.query(sqlInsert, function(err, products) {
                    if (err) throw err;
                    res.redirect('/');
                })
            }
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

    isLoginTrue(req, res, next) {
        const sqlFind = `SELECT * FROM users WHERE username = "${req.body.username}" AND password = "${req.body.password}"`;
        db.query(sqlFind, (err, result) => {
            if (err) res.json({ message: "Có lôi!"});
            if (result[0]) {
                res.json({ isTrue: true });
            }
            else {
                res.json({ isTrue: false});
            }
        });
    }

    isSignupTrue(req, res, next) {
        const sqlFind = `SELECT * FROM users WHERE username = "${req.body.username}"`;
        db.query(sqlFind, (err, result) => {
            if (err) res.json({ message: "Có lôi!"});
            if (result[0]) {
                res.json({ isTrue: false });
            }
            else {
                res.json({ isTrue: true });
            }
        })
    }

    getUser(req, res, next) {
        res.json({ user: req.user });
    }

    isAdmin(req, res, next) {
        const SQL = `SELECT * FROM users WHERE userId = ${req.user.userId}`;
        db.query(SQL, (err, result) => {
            if (err) throw err;
            result = Array.from(result)[0];
            res.json({ isAdmin: result.role === 'admin' });  
        })
    }

}


module.exports = new SiteController();
