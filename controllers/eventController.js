const eventService = require('../service/eventService');

const createEvent = async (req, res, next) => {
  const { user: { _id: userId }  } = req;
  const data = { ...req.body, userId };

  try {
    const event = await eventService.createEvent(data);
    return res.status(201).json(event) 
  } catch (err) {
    return next(err);
  }
};

const getAll = async (_req, res, next) => {
  try {
    const allEvents = await eventService.getAll();
    return res.status(200).json(allEvents);
  } catch (err) {
    return next(err);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const event = await eventService.getById(id);
    return res.status(200).json(event);
  } catch (err) {
    return next(err);
  }
};


module.exports = { createEvent, getAll, getById };
