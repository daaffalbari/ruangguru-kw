const bcrypt = require('bcrypt');
const { User } = require('../../../models');
const Validator = require('fastest-validator');
const v = new Validator();

module.exports = async (req, res) => {
  const scheme = {
    name: 'string|empty:false',
    email: 'email|empty:false',
    password: 'string|min:6',
    profession: 'string|optional',
  };

  const validate = v.validate(req.body, scheme); // return array
  if (validate.length) {
    return res.status(400).json({
      status: 'error',
      message: validate,
    });
  }

  // Email Check
  const user = await User.findOne({
    where: { email: req.body.email },
  });
  if (user) {
    return res.status(409).json({
      status: 'error',
      message: 'email already exist',
    });
  }

  // Password Hashing
  const password = await bcrypt.hash(req.body.password, 10);

  // Create User
  const data = {
    password,
    name: req.body.name,
    email: req.body.email,
    profession: req.body.profession,
    role: 'student',
  };

  // Save to Database
  const createUser = await User.create(data);

  // Return Response
  return res.json({
    status: 'success',
    data: {
      id: createUser.id,
      name: createUser.name,
      email: createUser.email,
      profession: createUser.profession,
      role: createUser.role,
    },
  });
};
