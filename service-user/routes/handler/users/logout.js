const { User, RefreshToken } = require('../../../models');

// Logout User
module.exports = async (req, res) => {
  const userId = req.body.user_id;
  const user = await User.findByPk(userId);

  // Check User Exist or Not
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'user not found',
    });
  }

  await RefreshToken.destroy({
    where: { user_id: userId },
  });

  return res.json({
    status: 'success',
    message: 'user logout successfully',
  });
};
