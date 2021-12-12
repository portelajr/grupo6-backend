require('dotenv').config();
const jwt = require('jsonwebtoken');

const jwtConfig = {
    expiresIn: '7d',
    algorithm: 'HS256',
};

const secret = process.env.JWT_SECRET;

const token = (payload) => {
  const generateToken = jwt.sign({ data: payload }, secret, jwtConfig);
  return generateToken;
};

module.exports = token;
