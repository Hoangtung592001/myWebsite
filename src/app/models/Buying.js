// const mongoose = require('mongoose');
// const slug = require('mongoose-slug-generator');
// const mongooseDelete = require('mongoose-delete');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

// const Course = mongoose.Schema({
//     _id: {type: Number},
//     name: {type: String, maxLength: 255, required: true},
//     description: {type: String, maxLength: 600},
//     image: {type: String, maxLength: 255},
//     videoId: {type: String, maxLength: 255, required: true},
//     level: {type: String, maxLength: 255},
//     slug: {type: String, slug: 'name', unique: true},
//     createdAt: { type: Date, default: Date.now},
//     updatedAt: { type: Date, default: Date.now},

// }, { 
//     _id: false,
//     timestamp: true,
// });
// // Add plugin
// mongoose.plugin(slug);

// Course.plugin(AutoIncrement);

// Course.plugin(mongooseDelete, {
//     deletedAt: true,    
//     overrideMethods: 'all'
// });

// module.exports = {
//     memberCollection: mongoose.model('Course', Course),
// }

const mysql = require('mysql');


const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '0865783836',
    database : 'sellingwebsite'
});

module.exports = db; 




