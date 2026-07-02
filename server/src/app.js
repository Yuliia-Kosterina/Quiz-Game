const express = require('express');
const apiRouter = require('./routes/apiRoute');
const serverConfig = require('./config/serverConfig');

const PORT = process.env.PORT ?? 3000;
const app = express();

serverConfig(app);
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
