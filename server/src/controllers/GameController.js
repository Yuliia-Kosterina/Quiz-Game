const GameService = require('../services/GameService');
const formatResponse = require('../utils/formatResponse');

class GameController {
  static async getCurrent(req, res) {
    const { user } = res.locals;

    try {
      const game = await GameService.getCurrentGame(user.id);

      return res
        .status(200)
        .json(formatResponse(200, 'Текущая игра получена', game));
    } catch (error) {
      console.log('======== GameController.getCurrent =========');
      console.log(error);
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера при получении текущей игры'));
    }
  }

  static async start(req, res) {
    const { user } = res.locals;

    try {
      const game = await GameService.startGame(user.id);

      return res.status(201).json(formatResponse(201, 'Игра создана', game));
    } catch (error) {
      console.log('======== GameController.start =========');
      console.log(error);
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера при создании игры'));
    }
  }

  static async getOne(req, res) {
    const { user } = res.locals;
    const { id } = req.params;

    if (Number.isNaN(Number(id))) {
      return res.status(400).json(formatResponse(400, 'Неверный формат id игры'));
    }

    try {
      const game = await GameService.getGameById(Number(id), user.id);

      if (!game) {
        return res.status(404).json(formatResponse(404, 'Игра не найдена'));
      }

      return res.status(200).json(formatResponse(200, 'Игра получена', game));
    } catch (error) {
      console.log('======== GameController.getOne =========');
      console.log(error);
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера при получении игры'));
    }
  }

  static async finish(req, res) {
    const { user } = res.locals;
    const { id } = req.params;

    if (Number.isNaN(Number(id))) {
      return res.status(400).json(formatResponse(400, 'Неверный формат id игры'));
    }

    try {
      const game = await GameService.finishGame(Number(id), user.id);

      if (!game) {
        return res.status(404).json(formatResponse(404, 'Игра не найдена'));
      }

      return res.status(200).json(formatResponse(200, 'Игра завершена', game));
    } catch (error) {
      console.log('======== GameController.finish =========');
      console.log(error);
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера при завершении игры'));
    }
  }

  static async openQuestion(req, res) {
    const { user } = res.locals;
    const { id, questionId } = req.params;

    if (Number.isNaN(Number(id)) || Number.isNaN(Number(questionId))) {
      return res
        .status(400)
        .json(formatResponse(400, 'Неверный формат id игры или вопроса'));
    }

    try {
      const result = await GameService.openQuestion(
        Number(id),
        Number(questionId),
        user.id,
      );

      if (!result) {
        return res.status(404).json(formatResponse(404, 'Игра не найдена'));
      }

      if (result.error) {
        return res.status(400).json(formatResponse(400, result.error));
      }

      return res.status(200).json(formatResponse(200, 'Вопрос открыт', result));
    } catch (error) {
      console.log('======== GameController.openQuestion =========');
      console.log(error);
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера при открытии вопроса'));
    }
  }

  static async answerQuestion(req, res) {
    const { user } = res.locals;
    const { id, questionId } = req.params;
    const { answer } = req.body;

    if (Number.isNaN(Number(id)) || Number.isNaN(Number(questionId))) {
      return res
        .status(400)
        .json(formatResponse(400, 'Неверный формат id игры или вопроса'));
    }

    if (typeof answer !== 'string') {
      return res.status(400).json(formatResponse(400, 'Ответ должен быть строкой'));
    }

    try {
      const result = await GameService.answerQuestion(
        Number(id),
        Number(questionId),
        user.id,
        answer,
      );

      if (!result) {
        return res.status(404).json(formatResponse(404, 'Игра не найдена'));
      }

      if (result.error) {
        return res.status(400).json(formatResponse(400, result.error));
      }

      return res.status(200).json(formatResponse(200, 'Ответ обработан', result));
    } catch (error) {
      console.log('======== GameController.answerQuestion =========');
      console.log(error);
      return res
        .status(500)
        .json(formatResponse(500, 'Ошибка сервера при обработке ответа'));
    }
  }
}

module.exports = GameController;
