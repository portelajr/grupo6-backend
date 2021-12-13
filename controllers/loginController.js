const loginService = require('../service/loginService');

const loginUser = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const { token, user } = await loginService.loginUser(payload);
    return res.status(200).json({ token, user });
  } catch (err) {
    return next(err);
  }
};

module.exports = { loginUser };
