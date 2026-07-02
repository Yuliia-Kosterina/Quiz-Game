const gameRouter = require('express').Router();
const GameController = require('../controllers/GameController');
const verifyAccessToken = require('../middleware/verifyAccessToken');

gameRouter
  .get('/current', verifyAccessToken, GameController.getCurrent)
  .post('/', verifyAccessToken, GameController.start)
  .get('/:id', verifyAccessToken, GameController.getOne)
  .post('/:id/finish', verifyAccessToken, GameController.finish)
  .post('/:id/questions/:questionId/open', verifyAccessToken, GameController.openQuestion)
  .post('/:id/questions/:questionId/answer', verifyAccessToken, GameController.answerQuestion);

module.exports = gameRouter;
