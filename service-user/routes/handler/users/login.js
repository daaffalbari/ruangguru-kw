const bcrypt = require('bcrypt');
const { User } = require('../../../models');
const Validator = require('fastest-validator');
const v = new Validator();

module.exports = async (req, res) => {
  const scheme = {
    email: 'email|empty:false',
    password: 'string|min:6',
  };

  // Validate Request with Fastest Validator
  const validate = v.validate(req.body, scheme);

  if (validate.length) {
    return res.status(400).json({
      status: 'error',
      message: validate,
    });
  }

  const user = await User.findOne({
    where: { email: req.body.email },
  });

  // Check User Exist or Not
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'user not found',
    });
  }

  // Compare Password
  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) {
    return res.status(404).json({
      status: 'error',
      message: 'password is wrong',
    });
  }

  return res.json({
    status: 'success',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profession: user.profession,
      avatar: user.avatar,
    },
  });
};
