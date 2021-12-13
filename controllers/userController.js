const userService = require('../service/userService');

const createUser = async (req, res, next ) => {
  const { name, password, email } = req.body;
  
  try {
    const user = await userService.createUser(name, password, email);
    return res.status(201).json({ user });
  } catch (err) {
    return next(err);
  }
};

const getUserByToken = async (req, res, next ) => {
  return res.status(200).json(req.user);
};

const rotaTeste = async (_req, res) => {
  return res.status(200).json({ message: 'Autenticado!'})  // teste
};

module.exports = { createUser, rotaTeste, getUserByToken }
