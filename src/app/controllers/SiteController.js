const UserService = require('../dbserver/UserService');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Validate = require('../service/validate');
class SiteController {
    home(req, res, next) {
        res.send('CitizenZ');
    }

    async signup(req, res, next) {
        try {
            const salt = await bcrypt.genSalt(10);
            const user = req.body;
            UserService.getUserByUsername(user.username)
                .then(async data => {
                    if (data[0]) {
                        return res.status(400).json({
                            error: true,
                            msg: 'Tài khoản đã tồn tại!',
                        });
                    }
                    user.password = await bcrypt.hash(user.password, salt);
                    user.role = 'A2';
                    UserService.addUser(user)
                        .then(created => {
                            if (!created) {
                                return res.status(400).json({
                                    error: true,
                                    msg: 'Chưa đăng kí được tài khoản',
                                });
                            }
                            res.status(201).json({
                                error: false,
                                msg: 'Đăng kí tài khoản thành công',
                                user
                            });
                        })
                });
        }
        catch(err) {
            res.status(500).send('server error ' + err.message);
        }
    }

    async login(req, res, next) {
        try {
            const user = req.body;
            Validate.user(user)
                .then(async data => {
                    return res.json(data);
                })
        }
        catch(err) {
            res.status(500).send('server error ' + err.message);
        }
    }
}

module.exports = new SiteController();
