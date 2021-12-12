const getConnection = require('./connection')

const createUser= async (name, password, email) => {
  const db = await getConnection();
  
  const user = await db.collection('users')
    .insertOne({ name, email, password })
  
  const { id: insetedId } = user;

  return { id, name, email };
};

module.exports = { createUser };

