const { User } = require('../../../models');

// Get List of Users
module.exports = async (req, res) => {
  const userIds = req.query.user_id || [];
  const sqlOptions = {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'password'],
    },
  };

  if (userIds.length) {
    sqlOptions.where = {
      id: userIds,
    };
  }

  const users = await User.findAll(sqlOptions);

  return res.json({
    status: 'success',
    data: users,
  });
};
