const resultRouter = require('express').Router();
const ResultController = require('../controllers/ResultController');
const verifyAccessToken = require('../middleware/verifyAccessToken');

resultRouter
  .get('/me', verifyAccessToken, ResultController.getMine)
  .get('/leaderboard', verifyAccessToken, ResultController.getLeaderboard);

module.exports = resultRouter;
