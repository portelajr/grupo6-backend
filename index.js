const express = require('express');

const PORT = 3000;
const app = express();

app.get('/home', (_req, res) => {
  res.status(200).json({ message: 'Rodando home' })
});

app.listen(PORT, () => {
    console.log('Aplicação ouvindo na porta 3001');
});
