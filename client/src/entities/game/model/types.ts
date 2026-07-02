export type BoardCellType = {
  id: number;
  price: number;
  status: "pending" | "opened" | "answered" | "timed_out";
  awardedScore: number;
  isCorrect: boolean | null;
  deadlineAt: string | null;
};

export type BoardCategoryType = {
  id: number;
  title: string;
  position: number;
  questions: BoardCellType[];
};

export type BoardType = {
  id: number;
  title: string;
  categories: BoardCategoryType[];
};

export type GameType = {
  id: number;
  score: number;
  status: "active" | "finished";
  startedAt: string;
  finishedAt: string | null;
  board: BoardType;
};

export type OpenedQuestionType = {
  id: number;
  text: string;
  price: number;
  timeLimitSec: number;
  deadlineAt: string;
  status: "opened";
};

export type OpenQuestionResponseType = {
  game: GameType;
  question: OpenedQuestionType;
};

export type AnswerResponseType = {
  game: GameType;
  result: {
    questionId: number;
    isCorrect: boolean;
    awardedScore: number;
    status: "answered" | "timed_out";
    correctAnswer: string;
  };
};

export type MyResultsType = {
  stats: {
    gamesCount: number;
    totalScore: number;
    totalQuestions: number;
    playedQuestions: number;
    rightAnswers: number;
  };
  games: {
    id: number;
    score: number;
    status: "active" | "finished";
    boardTitle: string;
    startedAt: string;
    finishedAt: string | null;
    playedQuestions: number;
  }[];
};

export type LeaderboardRowType = {
  id: number;
  name: string;
  totalScore: number;
  gamesCount: number;
};
