const apiRouter = require('express').Router();
const authRouter = require('./authRoute');
const gameRouter = require('./gameRoute');
const resultRouter = require('./resultRoute');
const formatResponse = require('../utils/formatResponse');

apiRouter.use('/auth', authRouter);
apiRouter.use('/games', gameRouter);
apiRouter.use('/results', resultRouter);

apiRouter.use((req, res) => {
  res.status(404).json(formatResponse(404, 'Ресурс не найден'));
});

module.exports = apiRouter;
