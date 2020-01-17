const jwt = require('jsonwebtoken');
var con = require('../config/Database');
var user = require('../model/User');
var bcrypt = require('bcrypt');
// var logger = require('../config/Logger');

const secret = 'secret';
const saltOfRounds = 10;

exports.getAllUsers = function (req, res) {
    var sql = 'SELECT * FROM mobileweb.users';
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(404).send({
                'msg': err
            });
        } else {
            console.log("select all users success.");
            return res.status(200).send(result);
        }
    });
};

exports.getUser = function (req, res) {
    // var token = req.body.token || req.headers['x-access-token'] || req.query.token;
    // console.log(token);
    // decode = jwt.decode(token, {complete: true});
    // console.log(decode.payload.id);
    // var idUser = decode.payload.id;
    var idUser = req.params.id;
    var sql = "SELECT * FROM mobileweb.users WHERE id='" + idUser + "'";
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(404).send({
                'msg': err
            });
        } else {
            console.log("select 1 user success.");
            return res.status(200).send(result[0]);
        }
    });
};

exports.register = function (req, res) {
    var data = new user(req.body);
    var sql = "SELECT * FROM mobileweb.users WHERE username='" + data.username + "'";
    console.log(sql);
    con.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                return res.status(404).send({
                    'msg': err
                });
            } else {
                if (result.length === 0) {
                    const hash = bcrypt.hashSync(req.body.password, saltOfRounds);
                    data.password = hash;
                    var sql2 = "INSERT INTO mobileweb.users (id, username, password) VALUES (DEFAULT, '" + data.username + "', '" + data.password + "')";
                    console.log(sql2);
                    con.query(sql2, function (err, result) {
                        if (err) {
                            console.log(err);
                            return res.status(404).send({
                                'msg': err
                            });
                        } else {
                            console.log("Created user!")
                            return res.status(200).send({
                                'msg': "Created User!!!"
                            });
                        }
                    });
                } else {
                    console.log("Username has been used!");
                    return res.status(500).send({
                        'msg': "Username has been used!!!"
                    });
                }
            }
        }
    );
};

exports.login = function (req, res) {
    let sql = "SELECT * FROM mobileweb.users WHERE username ='" + req.body.username + "'";
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(404).send({
                'msg': err
            });
        } else {
            if (result.length === 0) {
                console.log("Username not exist!");
                return res.status(404).send({
                    'msg': "Username not exist!"
                });
            } else {
                var dataUser = new user(result[0]);
                console.log(dataUser);
                bcrypt.compare(req.body.password, dataUser.password, (err, next) => {
                    console.log(next);
                    if (next === true) {
                        console.log("password is correct");
                        var token = jwt.sign({id: dataUser.id}, secret, {
                            expiresIn: 300 // expires in 5 min
                        });
                        return res.status(200).send({token: token, 'msg': 'Login success!!!'});
                    } else {
                        console.log("password not correct");
                        return res.status(404).send({
                            'msg': "password not correct"
                        });
                    }
                });
            }
        }
    })
};
