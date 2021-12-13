const getConnection = require('./connection');

const getByEmail = async (email) => {
  const db = await getConnection();
  return getUser = await db.collection('users').findOne({ email });
}

const createUser= async (name, password, email) => {
  const db = await getConnection();
  
  const user = await db.collection('users')
    .insertOne({ name, email, password })

  const { insertedId } = user;
  return { userId: insertedId , name, email, password }
};


module.exports = { createUser, getByEmail };
