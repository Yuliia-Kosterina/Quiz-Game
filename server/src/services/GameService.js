const { Game } = require('../db/models');
const quizCatalog = require('../data/quizCatalog');
const normalizeAnswer = require('../utils/normalizeAnswer');

class GameService {
  static async getCurrentGame(userId) {
    const game = await Game.findOne({
      where: {
        user_id: userId,
        status: 'active',
      },
      order: [['createdAt', 'DESC']],
    });

    if (!game) {
      return null;
    }

    await this.expireOldQuestions(game);
    return this.formatGame(game);
  }

  static async startGame(userId) {
    const oldGame = await this.getCurrentGame(userId);

    if (oldGame) {
      return oldGame;
    }

    const game = await Game.create({
      user_id: userId,
      status: 'active',
      score: 0,
      started_at: new Date(),
      board_data: this.makeBoardState(),
    });

    return this.formatGame(game);
  }

  static async getGameById(gameId, userId) {
    const game = await Game.findOne({
      where: {
        id: gameId,
        user_id: userId,
      },
    });

    if (!game) {
      return null;
    }

    await this.expireOldQuestions(game);
    return this.formatGame(game);
  }

  static async finishGame(gameId, userId) {
    const game = await Game.findOne({
      where: {
        id: gameId,
        user_id: userId,
      },
    });

    if (!game) {
      return null;
    }

    // Если игра уже завершена, просто возвращаем данные.
    if (game.status === 'finished') {
      return this.formatGame(game);
    }

    game.status = 'finished';
    game.finished_at = new Date();
    await game.save();

    return this.formatGame(game);
  }

  static async openQuestion(gameId, questionId, userId) {
    const game = await Game.findOne({
      where: {
        id: gameId,
        user_id: userId,
      },
    });

    if (!game) {
      return null;
    }

    await this.expireOldQuestions(game);

    const board = this.getBoardFromGame(game);
    const openedQuestion = this.findOpenedQuestion(board);

    if (openedQuestion && openedQuestion.id !== questionId) {
      return {
        error: 'Сначала ответьте на уже открытый вопрос',
      };
    }

    const question = this.findQuestion(board, questionId);

    if (!question) {
      return {
        error: 'Вопрос не найден',
      };
    }

    if (question.status === 'answered' || question.status === 'timed_out') {
      return {
        error: 'Этот вопрос уже сыгран',
      };
    }

    if (question.status === 'pending') {
      const now = new Date();
      const deadlineAt = new Date(
        now.getTime() + question.timeLimitSec * 1000,
      ).toISOString();

      question.status = 'opened';
      question.openedAt = now.toISOString();
      question.deadlineAt = deadlineAt;
    }

    await this.saveBoard(game, board);

    return {
      game: this.formatGame(game),
      question: {
        id: question.id,
        text: question.text,
        price: question.price,
        timeLimitSec: question.timeLimitSec,
        deadlineAt: question.deadlineAt,
        status: question.status,
      },
    };
  }

  static async answerQuestion(gameId, questionId, userId, userAnswer) {
    const game = await Game.findOne({
      where: {
        id: gameId,
        user_id: userId,
      },
    });

    if (!game) {
      return null;
    }

    await this.expireOldQuestions(game);

    const board = this.getBoardFromGame(game);
    const question = this.findQuestion(board, questionId);

    if (!question) {
      return {
        error: 'Вопрос не найден',
      };
    }

    if (question.status === 'timed_out') {
      return {
        error: 'Время на этот вопрос уже истекло',
      };
    }

    if (question.status === 'answered') {
      return {
        error: 'Ответ на этот вопрос уже сохранён',
      };
    }

    if (question.status !== 'opened') {
      return {
        error: 'Сначала откройте вопрос',
      };
    }

    const now = new Date();

    if (question.deadlineAt && now > new Date(question.deadlineAt)) {
      this.markQuestionAsTimeout(game, question);
      this.finishGameIfNeeded(game);
      await this.saveBoard(game, board);

      return {
        game: this.formatGame(game),
        result: {
          questionId,
          isCorrect: false,
          awardedScore: -question.price,
          status: 'timed_out',
          correctAnswer: question.answer,
        },
      };
    }

    const clearUserAnswer = normalizeAnswer(userAnswer);
    const clearRightAnswer = normalizeAnswer(question.answer);
    const isCorrect = clearUserAnswer.length > 0 && clearUserAnswer === clearRightAnswer;
    const points = isCorrect ? question.price : 0;

    question.status = 'answered';
    question.answeredAt = now.toISOString();
    question.userAnswer = userAnswer;
    question.isCorrect = isCorrect;
    question.awardedScore = points;

    game.score += points;
    this.finishGameIfNeeded(game);
    await this.saveBoard(game, board);

    return {
      game: this.formatGame(game),
      result: {
        questionId,
        isCorrect,
        awardedScore: points,
        status: 'answered',
        correctAnswer: question.answer,
      },
    };
  }

  static async expireOldQuestions(game) {
    const board = this.getBoardFromGame(game);
    let changed = false;

    for (const category of board.categories) {
      for (const question of category.questions) {
        if (
          question.status === 'opened' &&
          question.deadlineAt &&
          new Date() > new Date(question.deadlineAt)
        ) {
          this.markQuestionAsTimeout(game, question);
          changed = true;
        }
      }
    }

    if (changed) {
      this.finishGameIfNeeded(game);
      await this.saveBoard(game, board);
    }
  }

  static markQuestionAsTimeout(game, question) {
    if (question.status === 'timed_out') {
      return;
    }

    question.status = 'timed_out';
    question.answeredAt = new Date().toISOString();
    question.isCorrect = false;
    question.awardedScore = -question.price;

    game.score += question.awardedScore;
  }

  static finishGameIfNeeded(game) {
    const board = this.getBoardFromGame(game);
    const hasQuestionsLeft = board.categories.some((category) =>
      category.questions.some(
        (question) =>
          question.status === 'pending' || question.status === 'opened',
      ),
    );

    if (!hasQuestionsLeft) {
      game.status = 'finished';
      game.finished_at = new Date();
    }
  }

  static makeBoardState() {
    return {
      id: quizCatalog.id,
      title: quizCatalog.title,
      categories: quizCatalog.categories.map((category) => ({
        id: category.id,
        title: category.title,
        position: category.position,
        questions: category.questions.map((question) => ({
          id: question.id,
          price: question.price,
          position: question.position,
          timeLimitSec: question.timeLimitSec,
          text: question.text,
          answer: question.answer,
          status: 'pending',
          awardedScore: 0,
          isCorrect: null,
          deadlineAt: null,
          openedAt: null,
          answeredAt: null,
          userAnswer: '',
        })),
      })),
    };
  }

  static getBoardFromGame(game) {
    if (!game.board_data) {
      game.board_data = this.makeBoardState();
    }

    return game.board_data;
  }

  static async saveBoard(game, board) {
    // Клонируем объект, чтобы Sequelize точно увидел изменение JSONB-поля.
    game.board_data = JSON.parse(JSON.stringify(board));
    game.changed('board_data', true);
    await game.save();
  }

  static findQuestion(board, questionId) {
    for (const category of board.categories) {
      const question = category.questions.find((item) => item.id === questionId);

      if (question) {
        return question;
      }
    }

    return null;
  }

  static findOpenedQuestion(board) {
    for (const category of board.categories) {
      const openedQuestion = category.questions.find(
        (item) => item.status === 'opened',
      );

      if (openedQuestion) {
        return openedQuestion;
      }
    }

    return null;
  }

  static formatGame(game) {
    const board = this.getBoardFromGame(game);

    return {
      id: game.id,
      score: game.score,
      status: game.status,
      startedAt: game.started_at,
      finishedAt: game.finished_at,
      board: {
        id: board.id,
        title: board.title,
        categories: board.categories.map((category) => ({
          id: category.id,
          title: category.title,
          position: category.position,
          questions: category.questions.map((question) => ({
            id: question.id,
            price: question.price,
            status: question.status,
            awardedScore: question.awardedScore,
            isCorrect: question.isCorrect,
            deadlineAt: question.deadlineAt,
          })),
        })),
      },
    };
  }
}

module.exports = GameService;
