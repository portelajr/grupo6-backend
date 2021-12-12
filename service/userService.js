const userModel = require('../models/userModel');
const newError = require('../utils/errorGenerator');
const { userEntries } = require('../utils/validateUser');

const createUser = async (name, password, email) => {
  userEntries(name, password, email);
  const checkDB = await userModel.getByEmail(email);

  if (checkDB !== null) {
    const err = newError(400, 'Email already in use');
    throw err;
  }

  const user = await userModel.createUser(name,password, email);
  return user;
}

module.exports = { createUser };
