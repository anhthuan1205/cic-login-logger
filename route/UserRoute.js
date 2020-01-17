var express = require('express');
var router = express.Router();
var userController = require('../controller/UserController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.post('/login', userController.login);
router.post('/register', userController.register);

module.exports = router;
