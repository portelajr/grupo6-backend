const getConnection = require('./connection');

const createEvent = async (data) => {
  const db = await getConnection();
  
  const event = await db.collection('events').insertOne({ ...data });
  
  const { _id, name } = event;
  return { eventId: _id, name };
};

module.exports = { createEvent };
