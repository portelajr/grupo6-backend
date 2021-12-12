const express = require('express');
const bodyParser = require('body-parser');

const errorMiddleware = require('./middlewares/errorMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const userController = require('./controllers/userController');
const loginController = require('./controllers/loginController');

const PORT = 3000;
const app = express();
app.use(bodyParser.json());

app.post('/user', userController.createUser);
app.post('/login', loginController.loginUser)
app.get('/user', authMiddleware, userController.rotaTeste);  // rota teste com autenticação
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log('Aplicação ouvindo na porta 3000');
});
