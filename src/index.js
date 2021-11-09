/**
 *
 */
const path = require('path');
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const route = require('./routes');
const methodOverride = require('method-override');
const socketio = require('socket.io');
const app = express();
const cookieParser = require('cookie-parser');
const server = http.createServer(app);
const io = socketio(server);
const comment = require('./socket/comments');

const port = 3000;
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
// Custom middlewares
// app.use(sortMiddleware);
app.use(methodOverride('_method'));
// HTTP loggers
app.use(morgan('combined'));
// Template engine
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        helpers: {
            discountValues: (value, discount) => value * (100 - discount) / 100,
            values: (value) => {
                const formatter = new Intl.NumberFormat();
                return formatter.format(value);
            },
            pagination: (page, iterator, endingLink, numberOfPages, url) => {
                var result = ``;
                if (page > 1) {
                    result += `
                    <li class="pagination-item">
                        <a href="${url}?page=${page-1}" class="pagination-item__link">
                            <i class="pagination-item__icon fas fa-chevron-left"></i>
                        </a>
                    </li>
                    `
                }
                for (var i = iterator; i <= endingLink; i++) {
                    if (i <= 0) {
                        continue;
                    }
                    if (i === page) {
                        result += `
                        <li class="pagination-item pagination-item--active">
                            <a href="${url}?page=${i}" class="pagination-item__link">${i}</a>
                         </li>
                        `;
                        continue;
                    }
                    else {
                        result += `
                        <li class="pagination-item">
                        <a href="${url}?page=${i}" class="pagination-item__link">${i}</a>
                        </li>
                        `;
                    }
                }

                if (page < numberOfPages) {
                    result += `
                    <li class="pagination-item">
                        <a href="${url}?page=${page+1}" class="pagination-item__link">
                            <i class="pagination-item__icon fas fa-chevron-right"></i>
                        </a>
                    </li>
                    `
                }
                return result;
            },
            isAllTrue: (a, b) => a && b,
        }
    }),
);
io.on('connection', socket => {
    socket.on('joinProduct' , (user) => {
        socket.join(user.productCode);
    })
    socket.on('message', ({ msg, userInfo }) => {
        io.to(userInfo.productCode).emit('chatMessage', { msg: msg, userInfo });
    });

})
    
// Dat cai ung dung su dung view engine la handlebars
app.set('view engine', 'hbs');
// Set direction of views
app.set('views', path.join(__dirname, 'resources\\views'));

// route init
route(app);

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;




