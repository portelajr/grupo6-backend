const getConnection = require('./connection');
const { ObjectId } = require('mongodb');
const newError = require('../utils/errorGenerator');

const createEvent = async (data) => {
  const db = await getConnection();
  
  const event = await db.collection('events').insertOne({ ...data });
  console.log(event);
  
  return { title: data.title, date: data.date };
};

const getAll = async () => {
  const db = await getConnection();

  const allEvents = await db.collection('events').find().toArray();

  return allEvents;
};

const getById = async (id) => {
  const db = await getConnection();

  const event = await db.collection('events').findOne({ _id: ObjectId(id)});
  return event;
};

module.exports = { createEvent, getAll, getById };
