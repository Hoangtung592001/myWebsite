const db = require('./models/model');

db.connect();

class UserService {
    async addUser(user) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO users SET ? ';
                db.query(query, [user], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            })
            return response === 1 ? true : false;
        }
        catch(err) {
            console.log(error);
        }
    }

    async getUserByUsername(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM users WHERE username = ?';
                db.query(query, [username], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    
}

module.exports = new UserService();