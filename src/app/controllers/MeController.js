const db = require('../models/Me');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require("crypto");
const paginating = require('../function/pagination');
const isLoggedIn = require('../middlewares/isLogged_in');
db.connect();

class MeController {
    // [GET] /me
    myInfo(req, res, next) {
        const sql = `SELECT * FROM users WHERE users.userId = ${req.user.userId}`;
        db.query(sql, (err, user) => {
            user = Array.from(user)[0];
            res.render('me/info', { user: user });  
        })
    }

    // [GET] /me/order
    order(req, res, next) {
        const user = req.user;        
        const conFirmSql = `SELECT *, sum(o.quantityOrdered) as quantity FROM ordercart o` +
        ` join products on o.productCode = products.productCode` +
        ` WHERE customerId = ${user.userId}` +
        ` GROUP BY o.productCode;`

        // `WHERE userId = ${user.userId}`;
        db.query(conFirmSql, (err, confirmProducts) => {
            const purchasedSql = `select * from orderdetails` + 
            ` join orders on orderdetails.orderNumber = orders.orderNumber` +
            ` join products on orderdetails.productCode = products.productCode` +
            ` WHERE orders.customerId = ${user.userId};`
            // res.json(products);
            db.query(purchasedSql, (err, purchasedProducts) => {
                const totalSumQuery = `SELECT SUM(o.quantityOrdered * o.priceEach * (100 - p.discount) / 100) as totalCost` +
                ` from ordercart o` + 
                ` join products p on o.productCode = p.productCode` + 
                ` where o.customerId = ${req.user.userId};`
                db.query(totalSumQuery, (err, totalSum) => {
                    // res.json({totalCost: totalSum});
                    res.render('me/myOrder', { 
                        confirmProducts: confirmProducts, 
                        purchasedProducts: purchasedProducts, 
                        totalCost: totalSum});
                })
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

    confirmPurchase(req, res, next) {
        const maxSQL = 'SELECT MAX(orderNumber) as max FROM orderdetails';
        let confirmedProducts = req.body.confirmedProduct;
        if (typeof confirmedProducts !== 'object') {
            confirmedProducts = [confirmedProducts];
        }
        db.query(maxSQL, (err, max) => {
            let maxOrder = max[0].max;
            maxOrder++;
            let resultSQL = ``;
            const addOrdersSQL = `INSERT INTO orders ` +
                    `VALUES(${maxOrder}, "2002-02-20", "2002-02-20",` +
                    ` "2002-02-20", "Sucess", "", ${req.user.userId}, "Thuận Thành"); `;
            db.query(addOrdersSQL);
            confirmedProducts.forEach(confirmedProduct => {
                // res.json({confirmedProduct: confirmedProduct});
                const findSQL = `SELECT * FROM ordercart WHERE customerId = ${req.user.userId}` +
                ` AND productCode = "${confirmedProduct}"`;
                db.query(findSQL, (err, orderedProduct) => {
                    // res.json({orderedProduct});
                    // Add to purchased
                    orderedProduct = Array.from(orderedProduct)[0];
                    const addOrderdetailsSQL =` INSERT INTO orderdetails` +
                    ` VALUES(${maxOrder}, "${confirmedProduct}", ${orderedProduct.quantityOrdered}, ${orderedProduct.priceEach}); `;
                    const deleteOrderCart = ` DELETE FROM ordercart WHERE customerId = ${req.user.userId} AND productCode = "${confirmedProduct}"; `;
                    const findProductSQL = `SELECT * FROM products WHERE productCode = "${confirmedProduct}"`;
                    db.query(findProductSQL, (err, product) => {
                        product = Array.from(product)[0];
                        const quantityInstockNew = Number(Number(product.quantityInStock) - Number(orderedProduct.quantityOrdered));
                        const soldQuantityNew = Number(Number(product.soldQuantity) + Number(orderedProduct.quantityOrdered));
                        const updateProductSQL = `UPDATE products` +
                        ` SET quantityInStock = ${quantityInstockNew},` +
                        ` soldQuantity = ${soldQuantityNew} ` +
                        `WHERE productCode = "${confirmedProduct}"`;
                        db.query(updateProductSQL);
                    })
                    
                    db.query(addOrderdetailsSQL);
                    db.query(deleteOrderCart);
                })
            })
        })
        res.redirect('back');
        // const sql = `SELECT * FROM ordercart WHERE customerId = ${req.user.userId} AND productCode = "${}"`
    };

    deleteConfirmProducts(req, res, next) {
        const deleteQuery = `DELETE FROM ordercart WHERE` +
        ` productCode = "${req.params.productCode}" AND customerId = ${req.user.userId}`;
        db.query(deleteQuery);
        res.redirect('back');
    }

    productInfo(req, res, next) {
        const findProductQuery = `SELECT * FROM products WHERE productCode = "${req.params.productCode}"`;
        db.query(findProductQuery, (err, product) => {
            product = Array.from(product)[0];
            res.render('me/productInfo', {product: product});
        })
    }

    editProducts(req, res, next) {
        // res.json({product: req.body});
        const updateSQL = `UPDATE products` + 
        ` SET productName = "${req.body.productName}",` +
        ` productline = "${req.body.productline}",` +
        ` quantityInStock = ${req.body.quantityInStock},` +
        ` buyPrice = ${req.body.buyPrice},` +
        ` image = "${req.body.image}",` +
        ` origin = "${req.body.origin}",` +
        ` discount = ${req.body.discount}` +
        ` WHERE productCode = "${req.params.productCode}"`
        const updateOrdercart = `UPDATE ordercart` +
        ` SET priceEach = ${req.body.buyPrice}` + 
        ` WHERE productCode = "${req.params.productCode}"`;
        db.query(updateSQL);
        db.query(updateOrdercart);
        res.redirect('back');
    }

    deletePublishedProducts(req, res, next) {
        const deleteSQL = `DELETE FROM products WHERE productCode = "${req.params.productCode}"`;
        db.query(deleteSQL);
        res.redirect('/me/store');
    }

    changePasswordSite(req, res, next) {
        const findUserSQL = `SELECT * FROM users WHERE userId = '${req.user.userId}'`;
        db.query(findUserSQL, (err, user) => {
            user = Array.from(user)[0];
            res.render('me/change_password', {user: user});
        });
    }

    change_password(req, res, next) {
        const updatePasswordSQL = `UPDATE users` + 
        ` SET password = "${req.params.password}"` +
        ` WHERE userId = ${req.user.userId}`;
        db.query(updatePasswordSQL);
        req.isChangePassword = true;
        res.redirect('/me/logout');
    }

    destroyUser(req, res, next) {
        let deleteWantedUserIds = req.body.userId;
        if (typeof deleteWantedUserIds !== 'object') {
            deleteWantedUserIds = [deleteWantedUserIds];
        }
        if (!deleteWantedUserIds[0]) {
            res.redirect('/');
            return;
        }
        deleteWantedUserIds.forEach(deleteWantedUserId => {
            const deleteUserSQL = `DELETE FROM users WHERE userId = ${deleteWantedUserId}`;
            db.query(deleteUserSQL);
        })
        res.redirect('back');
    }

    deleteProductsByAdmin(req, res, next) {
        const deleteProductByAdminSQL = `DELETE FROM products WHERE productCode = "${req.params.productCode}"`;
        db.query(deleteProductByAdminSQL);
        res.redirect('/');
    }

    get_added_to_cart(req, res, next) {
        const sql = `SELECT * FROM ordercart join products on ordercart.productCode = products.productCode` +
                    ` WHERE customerId = ${req.user.userId}`;
        db.query(sql, (err, products) => {
            if (err) throw err;
            res.json({products: products});
        })
    }

    get_password(req, res, next) {
        const sql = `SELECT * FROM users WHERE userId = ${req.user.userId}`;
        db.query(sql, (err, user) => {
            if (err) throw err;
            user = Array.from(user)[0];
            res.json({ user: user });
        });
    }
};


module.exports = new MeController();
