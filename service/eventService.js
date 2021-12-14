const eventModel = require('../models/eventModel');
const newEventSchema = require('../utils/validateEvent');
const newError = require('../utils/errorGenerator');

const createEvent = async (data) => {

  const { error } = newEventSchema.validate(data);

  if (error) {

    const err = newError(400, 'Por favor, preencha todos os campos');
    throw err;
  }
  const created = await eventModel.createEvent(data);
  return created;
};

const getAll = async () => {
  const allEvents = await eventModel.getAll();
  
  if (allEvents === null) {
    const err = newError(400, 'Sem ocorrencias');
    throw err;
  }
  return allEvents;
};

const getById = async (id) => {
  const event = await eventModel.getById(id);
  
  if (!event) {
    const err = newError(400, 'Evento não encontrado');
    throw err;
  };

  return event;
};

module.exports = { createEvent, getAll, getById };
