const newEror = require('./errorGenerator');

const nameValidation = (name) => {
  if (!name) {
    const err = newEror(400, 'Name is required');
    throw err;
  }
};

const passwordValidation = (password) => {
  if (!password) {
    const err = newEror(400, 'Password field is required');
    throw err;
  }
};

const emailValidation = (email) => {
  if (!email) {
    const err = newEror(400, 'Email field is required');
    throw err;
  }

  const patternEmail = /^[\w.]+@[a-z]+\.\w{2,3}$/g.test(email);
  if (!patternEmail) {
    const err = newEror(400, 'Invalid email');
    throw err;
  }
};

const userEntries = (name, password, email) => {
  nameValidation(name);
  passwordValidation(password);
  emailValidation(email);
};

const loginEntries = (email, password) => {
  passwordValidation(password);
  emailValidation(email);
};


module.exports = userEntries;
module.exports = loginEntries;
