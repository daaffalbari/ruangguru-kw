// Import Refresh Token Model
const { RefreshToken } = require('../../../models');

module.exports = async (req, res) => {
  // Get Refresh Token
  const refreshToken = req.query.refresh_token;

  const token = await RefreshToken.findOne({
    where: { token: refreshToken },
  });

  // Check Refresh Token Exist or Not
  if (!token) {
    return res.status(404).json({
      status: 'error',
      message: 'invalid token',
    });
  }

  return res.json({
    status: 'success',
    data: token,
  });
};
