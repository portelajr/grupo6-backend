const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const errorMiddleware = require('./middlewares/errorMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const userController = require('./controllers/userController');
const loginController = require('./controllers/loginController');
const eventController = require('./controllers/eventController');

const PORT = 3001;
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', eventController.getAll);
app.get('/event/:id', eventController.getById)
app.post('/event', authMiddleware, eventController.createEvent);
app.get('/user', authMiddleware, userController.rotaTeste);  // rota teste com autenticação
app.post('/user', userController.createUser);
app.post('/login', loginController.loginUser);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Aplicação ouvindo na porta ${PORT}`);
});
