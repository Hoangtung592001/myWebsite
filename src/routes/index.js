const siteRouter = require('./site');
const meRouter = require('./me');
const buyingRouter = require('./buying');
function route(app) {
    app.use('/me', meRouter);

    app.use('/buying', buyingRouter);
    
    app.use('/', siteRouter);
};

module.exports = route;
