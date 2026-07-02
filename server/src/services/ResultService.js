const { User, Game } = require('../db/models');

class ResultService {
  static async getMyResults(userId) {
    const games = await Game.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],
    });

    const totalScore = games.reduce((sum, game) => sum + game.score, 0);
    const totalQuestions = games.reduce(
      (sum, game) => sum + this.countAllQuestions(game.board_data),
      0,
    );
    const playedQuestions = games.reduce(
      (sum, game) => sum + this.countPlayedQuestions(game.board_data),
      0,
    );
    const rightAnswers = games.reduce(
      (sum, game) => sum + this.countRightAnswers(game.board_data),
      0,
    );

    return {
      stats: {
        gamesCount: games.length,
        totalScore,
        totalQuestions,
        playedQuestions,
        rightAnswers,
      },
      games: games.map((game) => ({
        id: game.id,
        score: game.score,
        status: game.status,
        boardTitle: game.board_data?.title ?? 'Своя игра',
        startedAt: game.started_at,
        finishedAt: game.finished_at,
        playedQuestions: this.countPlayedQuestions(game.board_data),
      })),
    };
  }

  static async getLeaderboard() {
    const users = await User.findAll({
      include: [
        {
          model: Game,
          as: 'games',
        },
      ],
    });

    return users
      .map((user) => ({
        id: user.id,
        name: user.name,
        totalScore: user.games.reduce((sum, game) => sum + game.score, 0),
        gamesCount: user.games.length,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
  }

  static countAllQuestions(board) {
    if (!board?.categories) {
      return 0;
    }

    return board.categories.reduce(
      (sum, category) => sum + category.questions.length,
      0,
    );
  }

  static countPlayedQuestions(board) {
    if (!board?.categories) {
      return 0;
    }

    return board.categories.reduce(
      (sum, category) =>
        sum +
        category.questions.filter(
          (question) =>
            question.status === 'answered' || question.status === 'timed_out',
        ).length,
      0,
    );
  }

  static countRightAnswers(board) {
    if (!board?.categories) {
      return 0;
    }

    return board.categories.reduce(
      (sum, category) =>
        sum + category.questions.filter((question) => question.isCorrect).length,
      0,
    );
  }
}

module.exports = ResultService;
