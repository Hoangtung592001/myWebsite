/**
 *
 */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const route = require('./routes');
const app = express();
const cookieParser = require('cookie-parser');

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
// app.use(methodOverride('_method'));
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
            }
        }
    }),
    );
/*
                        <li class="pagination-item">
                            <a href="" class="pagination-item__link">
                                <i class="pagination-item__icon fas fa-chevron-left"></i>
                            </a>
                        </li>
                        <li class="pagination-item">
                            <a href="/?page=3" class="pagination-item__link">3</a>
                        </li>

                        <li class="pagination-item">
                            <a href="" class="pagination-item__link">
                                <i class="pagination-item__icon fas fa-chevron-right"></i>
                            </a>
                        </li>

*/




















// Dat cai ung dung su dung view engine la handlebars
app.set('view engine', 'hbs');
// Set direction of views
app.set('views', path.join(__dirname, 'resources\\views'));

// route init
route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;

// const express = require('express');
// const mysql = require('mysql');
// const app = express();


// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '0865783836',
//     database: 'sakila',
// });

// db.connect((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log('MySQL connected...')
// })

// app.get('/createdb', (req, res) => {
//     let sql = 'CREATE DATABASE nodemonsql';
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('database Created');
//     })
// })


// db.query('SELECT * FROM actor', function (error, results, fields) {
//     if (error) throw error;
//     console.log(results[0].first_name);
//   });


// app.listen('3000', () => {
    
// })




