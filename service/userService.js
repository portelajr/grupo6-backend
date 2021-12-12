const userModel = require('../models/userModel');
const userEntries = require('../utils/validateUser');

const createUser = async (name, password, email) => {
  userEntries(name, password, email);
  const user = await userModel.createUser(name,password, email);
  return user;
}

module.exports = { createUser };
