const userService = require('../service/userService');

const createUser = async (req, res, next ) => {
  const { name, password, email } = req.body;
  
  try {
    const user = await userService.createUser(name, password, email);
    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
};

module.exports = { createUser }
