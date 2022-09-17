const { User } = require('../../../models');

// Get User by ID
module.exports = async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id, {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'password'],
    },
  });

  // Check User Exist or Not
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'user not found',
    });
  }

  return res.json({
    status: 'success',
    data: user,
  });
};
