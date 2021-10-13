const db = require('../models/Buying');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');



// const mysql = require('mysql');
// const db = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '0865783836',
//     database : 'sellingwebsite'
// });
db.connect();

class BuyingController {
    // [GET] /buying/:id
    purchase(req, res, next) {
        const sql = `SELECT * FROM products WHERE productCode = "${req.params.productCode}"`;
        db.query(sql, function(err, product) {
            // res.json({product: product});
            product = Array.from(product)[0];
            res.render('buying/purchase', { product: product });
        })
    }
    
    // [POST] /buying/addToCart
    add_to_cart(req, res, next) {
        const findSql = `SELECT * FROM products WHERE productCode = "${req.params.productCode}"`;
        db.query(findSql, (err, product) => {
            product = Array.from(product)[0];
            if (product.quantityInStock < req.body.quantityOrdered) {
                res.send('Bạn mua quá số lượng hàng của Shop!');
            }
            else {
                const sql = `INSERT INTO ordercart VALUES((SELECT MAX(orderNumber) + 1 from ordercart as o),` +
                ` "${req.params.productCode}", ${req.body.quantityOrdered}, ${product.buyPrice}, ${req.user.userId})`;
                db.query(sql, (err1, err2) => {
                    if (err1) throw err1;
                    res.redirect('/me/order');
                })
            }
        })
    }
}


module.exports = new BuyingController();
