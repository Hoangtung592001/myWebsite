const db = require('../models/Me');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require("crypto");
const paginating = require('../function/pagination');
// const uuidv4 = require("uuid/v4");
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
db.connect();

// const mysql = require('mysql');
// const db = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '0865783836',
//     database : 'sellingwebsite'
// });

class MeController {
    // [GET] /me
    myInfo(req, res, next) {
        const user = req.user;
        const sql = `SELECT * FROM users WHERE users.userId = ${user.userId}`;
        db.query(sql, (err, user) => {
            res.render('me/info', { user: user });
        })
    }

    // [GET] /me/order
    order(req, res, next) {
        const user = req.user;
        // const sql = `SELECT * FROM` + 
        // ` (SELECT orders.orderNumber, customerId, ord.productCode, ord.quantityOrdered, ord.priceEach` +
        // ` FROM orders join orderdetails as ord on orders.orderNumber = ord.orderNumber` +
        // ` WHERE customerId = ${user.userId})` +
        // ` as ord1 join products where ord1.productCode = products.productCode;`;

        
        const conFirmSql = `SELECT * FROM products join (SELECT o.productCode, quantityOrdered, customerId FROM` + 
        ` ordercart o inner join products p on o.productCode = p.productCode WHERE customerId = ${user.userId})` + 
        `ord where ord.productCode = products.productCode;`

        // `WHERE userId = ${user.userId}`;
        db.query(conFirmSql, (err, confirmProducts) => {
            const purchasedSql = `select * from orderdetails` + 
            ` join orders on orderdetails.orderNumber = orders.orderNumber` +
            ` join products on orderdetails.productCode = products.productCode` +
            ` WHERE orders.customerId = ${user.userId};`
            // res.json(products);
            db.query(purchasedSql, (err, purchasedProducts) => {
                res.render('me/myOrder', { confirmProducts: confirmProducts, purchasedProducts: purchasedProducts});

            })
        })
    }

    logout(req, res, next) {
        res.clearCookie('token');
        res.redirect('/');
    }

    sale(req, res, next) {
        const user = req.user;
        const sql = `SELECT * FROM users WHERE users.userId = ${user.userId}`;
        db.query(sql, (err, users) => {
            res.render('me/sale');
        })
    }

    post_for_sale(req, res, next) {
        // res.json({body: req.body, user: req.user});
        const randomId = (crypto.randomBytes(20).toString('hex'));
        const body = req.body;
        const sql = `INSERT INTO products VALUES(` +
        `"${randomId}", "${body.productName}", "${body.productline}", ${body.quantityInStock}, ${body.buyPrice}, ` +
        `"${body.image}", "${body.origin}", ${body.discount}, "1", 0, ${req.user.userId})`;
        // const sql = `INSERT INTO products VALUES(` +
        // `"${randomId}", "Áo Man City", "Áo", 100, 120000, ` +
        // `"https://cf.shopee.vn/file/d22c79de0126bd2845ea21d663471a86", "Hàn Quốc", 20, "1", 0, ${req.user.userId})`;
        db.query(sql, function(err, products) {
            if (err) throw err;
            res.redirect('/me/sale');
            // res.json(products);
        })
    }

    store(req, res, next) {
        let sql = `SELECT * FROM products JOIN shoptype on products.shopTypeID = shoptype.shopTypeID WHERE userId = ${req.user.userId}`;
        paginating(req, res, next, sql, 'me/store', '/me/store');
    };

    user_list(req, res, next) {
        const sql = `SELECT * FROM users WHERE role != "admin"`
        db.query(sql, function (err, users) {
            res.render('me/user_list', { users });
        });
    };
};


module.exports = new MeController();
