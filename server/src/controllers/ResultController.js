const ResultService = require('../services/ResultService');
const formatResponse = require('../utils/formatResponse');

class ResultController {
  static async getMine(req, res) {
    const { user } = res.locals;

    try {
      const results = await ResultService.getMyResults(user.id);

      return res
        .status(200)
        .json(formatResponse(200, 'Результаты пользователя получены', results));
    } catch (error) {
      console.log('======== ResultController.getMine =========');
      console.log(error);
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера при получении результатов'));
    }
  }

  static async getLeaderboard(req, res) {
    try {
      const leaderboard = await ResultService.getLeaderboard();

      return res
        .status(200)
        .json(formatResponse(200, 'Таблица результатов получена', leaderboard));
    } catch (error) {
      console.log('======== ResultController.getLeaderboard =========');
      console.log(error);
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера при получении таблицы результатов'));
    }
  }
}

module.exports = ResultController;
