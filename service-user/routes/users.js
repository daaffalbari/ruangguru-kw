const express = require('express');
const router = express.Router();
require('dotenv').config();
const fs = require('fs');

const usersHandler = require('./handler/users');

// Post user register
router.post('/register', usersHandler.register);

// Post user login
router.post('/login', usersHandler.login);
router.post('/logout', usersHandler.logout);

// Put user update
router.put('/:id', usersHandler.update);
router.get('/:id', usersHandler.getUser);
router.get('/', usersHandler.getUsers);

module.exports = router;
