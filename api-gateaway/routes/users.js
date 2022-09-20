var express = require('express');
var router = express.Router();
const usersHandler = require('./handler/users');

router.post('/register', usersHandler.register);
router.post('/login', usersHandler.login);

module.exports = router;
