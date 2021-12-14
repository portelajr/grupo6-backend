const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const errorMiddleware = require('../middlewares/errorMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController');
const eventController = require('../controllers/eventController');

const PORT = 3001;
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/event', eventController.getAll);
app.get('/event/:id', eventController.getById)
app.post('/event', authMiddleware, eventController.createEvent);
app.post('/user', userController.createUser);
app.get('/user', userController.getUserByToken);
app.post('/login', loginController.loginUser);

app.use(errorMiddleware);

module.exports = app;
