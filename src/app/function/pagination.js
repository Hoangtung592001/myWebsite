const db = require('../models/Site');

module.exports = function(req, res, next, sql, view, url) {
    const resultPerPage = 30;
    db.query(sql, function(err, products) {
        if (err) throw err;
        if (products.length === 0) {
            res.render(view);
            return;
        }
        const numOfProducts = products.length;
        const numberOfPages = Math.ceil(numOfProducts / resultPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        if (page > numberOfPages) {
            res.redirect(`${url}/?page=`+encodeURIComponent(numberOfPages));
        } else if (page < 1) {
            res.redirect(`${url}/?page=`+encodeURIComponent('1'));
        }
        // 
        const startingLimit = (page - 1) * resultPerPage;
        const mySQL = sql + ` LIMIT ${startingLimit},${resultPerPage}`;
        db.query(mySQL, (err, products) => {
            if (err) throw err; 
            let iterator = page < 6 ? 1 : page - 5;
            let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
            if (endingLink < (page + 4)) {
                iterator -= (page + 4) - numberOfPages;
            }
            res.render(view, { products, page, iterator, endingLink, numberOfPages, url });
         })
        // res.json(products);
    })
}