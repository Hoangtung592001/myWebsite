const bcrypt = require('bcrypt');
const UserService = require('../dbserver/UserService');

class Validate {
    async user(user) {
        try {
            const response = await new Promise((resolve, reject) => {
                UserService.getUserByUsername(user.username)
                    .then(async data => {
                        const userInDb = data[0];
                        if (!userInDb) {
                            resolve({
                                error: true,
                                msg: 'Tài khoản không tồn tại',
                            })
                        }
                        const isMatched = await bcrypt.compare(
                            user.password, 
                            userInDb.password
                        );
                        if (!isMatched) {
                            resolve({
                                error: true,
                                msg: 'Bạn nhập sai mật khẩu!',
                            })
                        }
                        resolve(userInDb);
                    })
            })
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }
}

module.exports = new Validate();