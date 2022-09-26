var express = require('express');
var router = express.Router();
const refreshTokenHandler = require('./handler/refresh-tokens');

router.post('/', refreshTokenHandler.refreshToken);

module.exports = router;
