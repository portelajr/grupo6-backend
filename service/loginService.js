// const validationsLOgin
const newError = require('../utils/errorGenerator');
const tokenGenerator = require('../utils/tokenGenerator');
const validation = require('../utils/validateUser');
const userModel = require('../models/userModel');

const loginUser = async (payload) => {
  const { email, password } = payload;

  validation.loginEntries(email, password);

  const user = await userModel.getByEmail(email);

  if (user === null) {
    const err = newError(400, 'Usuário inválido')
    throw err;
  }

  if (user.password !== password) {
    const err = newError(400, 'Senha inválida')
    throw err;
  }

  const userWithoutPassword = { name: user.name, email }
  
  return { token: tokenGenerator(userWithoutPassword), user: userWithoutPassword };
};
  
module.exports = { loginUser };
