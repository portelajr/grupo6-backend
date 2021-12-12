const getConnection = require('./connection')

const createUser= async (name, password, email) => {
  const db = await getConnection();
  
  const user = await db.collection('users')
    .insertOne({ name, email, password })
  
  const { _id } = user;
  return { userId: _id , name, email, password }
};

module.exports = { createUser };
