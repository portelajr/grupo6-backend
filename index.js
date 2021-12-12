const express = require('express');
const bodyParser = require('body-parser');

const errorMiddleware = require('./middlewares/errorMiddleware');
const userController = require('./controllers/userController');

const PORT = 3000;
const app = express();
app.use(bodyParser.json());

app.post('/user', userController.createUser);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log('Aplicação ouvindo na porta 3000');
});
