// const validationsLOgin
const newError = require('../utils/errorGenerator');
const tokenGenerator = require('../utils/tokenGenerator');
const loginEntries = require('../utils/validateUser');
const userModel = require('../models/userModel');

const loginUser = async (payload) => {
  const { email, password } = payload;

  await loginEntries(email, password);

  const user = await userModel.getByEmail(email);

  if (user === null) {
    const err = newError(400, 'Usuário inválido')
    throw err;
  }
  
  return tokenGenerator(user);
};
  
module.exports = { loginUser };
