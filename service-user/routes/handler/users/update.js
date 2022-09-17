const bcrypt = require('bcrypt');
const { User } = require('../../../models');
const Validator = require('fastest-validator');
const v = new Validator();

module.exports = async (req, res) => {
  // Validate Request with Fastest Validator
  const scheme = {
    name: 'string|empty:false',
    email: 'email|empty:false',
    password: 'string|min:6',
    profession: 'string|optional',
    role: 'string|optional',
  };

  const validate = v.validate(req.body, scheme);
  if (validate.length) {
    return res.status(400).json({
      status: 'error',
      message: validate,
    });
  }

  const id = req.params.id;
  const user = await User.findByPk(id);

  // Check User Exist or Not
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'user not found',
    });
  }

  // Check Email Exist in Database
  const email = req.body.email;
  if (email) {
    const checkEmail = await User.findOne({
      where: { email },
    });

    if (checkEmail && email !== user.email) {
      return res.status(409).json({
        status: 'error',
        message: 'Email already Exist',
      });
    }
  }

  const password = await bcrypt.hash(req.body.password, 10);
  const { name, profession, role, avatar } = req.body;

  // Update User
  await user.update({
    password,
    name,
    email,
    profession,
    role,
    avatar,
  });

  return res.json({
    status: 'success',
    data: {
      id: user.id,
      name,
      email,
      role,
      profession,
      avatar,
    },
  });
};
