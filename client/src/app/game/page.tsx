"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import {
  useAnswerQuestionMutation,
  useFinishGameMutation,
  useGetCurrentGameQuery,
  useOpenQuestionMutation,
  useStartGameMutation,
} from "@/entities/game/api/quizApi";
import type { OpenedQuestionType } from "@/entities/game/model/types";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";
import GameBoard from "@/widgets/GameBoard/GameBoard";
import QuestionModal from "@/widgets/QuestionModal/QuestionModal";
import styles from "./page.module.css";

type NoticeType = {
  tone: "success" | "error" | "info";
  text: string;
};

export default function GamePage() {
  const user = useAppSelector((state) => state.user.user);
  const isInitialized = useAppSelector((state) => state.user.isInitialized);

  const { data, isLoading } = useGetCurrentGameQuery(undefined, {
    skip: !user,
  });
  const [startGame, { isLoading: isStarting }] = useStartGameMutation();
  const [finishGame, { isLoading: isFinishing }] = useFinishGameMutation();
  const [openQuestion, { isLoading: isOpening }] = useOpenQuestionMutation();
  const [answerQuestion, { isLoading: isAnswering }] = useAnswerQuestionMutation();

  const [openedQuestion, setOpenedQuestion] = useState<OpenedQuestionType | null>(
    null,
  );
  const [notice, setNotice] = useState<NoticeType | null>(null);

  const game = data?.data ?? null;
  const isBusy = isStarting || isFinishing || isOpening || isAnswering;

  const handleSendAnswer = useCallback(
    async (answer: string) => {
      if (!game || !openedQuestion) {
        return;
      }

      try {
        const response = await answerQuestion({
          gameId: game.id,
          questionId: openedQuestion.id,
          answer,
        }).unwrap();

        const result = response.data?.result;

        if (result?.status === "timed_out") {
          setNotice({
            tone: "info",
            text: `Время вышло. Правильный ответ: ${result.correctAnswer}`,
          });
        } else if (result?.isCorrect) {
          setNotice({
            tone: "success",
            text: `Верно! +${result.awardedScore} очков`,
          });
        } else {
          setNotice({
            tone: "error",
            text: `Неверно. Правильный ответ: ${result?.correctAnswer}`,
          });
        }

        setOpenedQuestion(null);
      } catch (error) {
        setNotice({
          tone: "error",
          text: getErrorMessage(error, "Не удалось отправить ответ"),
        });
      }
    },
    [answerQuestion, game, openedQuestion],
  );

  async function handleStartGame() {
    setNotice(null);

    try {
      await startGame().unwrap();
      setNotice({
        tone: "success",
        text: "Игра создана. Можно выбирать вопрос.",
      });
    } catch (error) {
      setNotice({
        tone: "error",
        text: getErrorMessage(error, "Не удалось создать игру"),
      });
    }
  }

  async function handleFinishGame() {
    if (!game) {
      return;
    }

    setNotice(null);

    try {
      await finishGame({ gameId: game.id }).unwrap();
      setOpenedQuestion(null);
      setNotice({
        tone: "info",
        text: "Игра завершена. Результат сохранён.",
      });
    } catch (error) {
      setNotice({
        tone: "error",
        text: getErrorMessage(error, "Не удалось завершить игру"),
      });
    }
  }

  async function handleFinishAndStartNewGame() {
    if (!game) {
      return;
    }

    setNotice(null);

    try {
      await finishGame({ gameId: game.id }).unwrap();
      setOpenedQuestion(null);
      await startGame().unwrap();
      setNotice({
        tone: "success",
        text: "Предыдущая игра завершена. Новая игра уже готова.",
      });
    } catch (error) {
      setNotice({
        tone: "error",
        text: getErrorMessage(error, "Не удалось начать новую игру"),
      });
    }
  }

  async function handleSelectQuestion(questionId: number) {
    if (!game) {
      return;
    }

    setNotice(null);

    try {
      const response = await openQuestion({
        gameId: game.id,
        questionId,
      }).unwrap();

      if (response.data?.question) {
        setOpenedQuestion(response.data.question);
      }
    } catch (error) {
      setNotice({
        tone: "error",
        text: getErrorMessage(error, "Не удалось открыть вопрос"),
      });
    }
  }

  if (!isInitialized) {
    return <div className={styles.state}>Проверяем сессию...</div>;
  }

  if (!user) {
    return (
      <div className={styles.state}>
        <p>Чтобы играть, нужно войти в систему.</p>
        <Link className={styles.link} href="/auth">
          Перейти ко входу
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className={styles.state}>Загружаем игру...</div>;
  }

  if (!game) {
    return (
      <div className={styles.empty}>
        <h1>У вас пока нет активной игры</h1>
        <p>Нажмите кнопку ниже, чтобы получить игровое поле.</p>
        <button
          className={styles.mainButton}
          onClick={handleStartGame}
          disabled={isStarting}
        >
          {isStarting ? "Создаём..." : "Начать новую игру"}
        </button>
        {notice && (
          <p className={`${styles.notice} ${styles[`notice_${notice.tone}`]}`}>
            {notice.text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.top}>
        <div className={styles.infoCard}>
          <p className={styles.small}>Игрок</p>
          <h1 className={styles.mainText}>{user.name}</h1>
        </div>
        <div className={styles.infoCard}>
          <p className={styles.small}>Счёт</p>
          <h2 className={styles.score}>{game.score}</h2>
        </div>
        <div className={styles.infoCard}>
          <p className={styles.small}>Статус игры</p>
          <h2 className={styles.mainText}>
            {game.status === "finished" ? "Завершена" : "Идёт"}
          </h2>
        </div>
      </section>

      {notice && (
        <div className={`${styles.notice} ${styles[`notice_${notice.tone}`]}`}>
          {notice.text}
        </div>
      )}

      <GameBoard
        game={game}
        onSelect={handleSelectQuestion}
        disabled={isBusy || game.status === "finished"}
      />

      {game.status !== "finished" && (
        <div className={styles.actions}>
          <button
            className={styles.secondaryButton}
            onClick={handleFinishGame}
            disabled={isBusy}
          >
            {isFinishing ? "Завершаем..." : "Завершить игру"}
          </button>
          <button
            className={styles.mainButton}
            onClick={handleFinishAndStartNewGame}
            disabled={isBusy}
          >
            {isStarting || isFinishing
              ? "Подождите..."
              : "Завершить и начать новую"}
          </button>
        </div>
      )}

      {game.status === "finished" && (
        <div className={styles.finish}>
          Игра закончена. Можно открыть раздел результатов или начать новую игру.
          <button
            className={styles.mainButton}
            onClick={handleStartGame}
            disabled={isStarting}
          >
            {isStarting ? "Создаём..." : "Новая игра"}
          </button>
        </div>
      )}

      <QuestionModal
        question={openedQuestion}
        isSending={isAnswering}
        onClose={() => setOpenedQuestion(null)}
        onSendAnswer={handleSendAnswer}
      />
    </div>
  );
}
