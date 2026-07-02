"use client";
import type {
  LeaderboardRowType,
  MyResultsType,
} from "@/entities/game/model/types";
import styles from "./ResultsTable.module.css";

type Props = {
  results: MyResultsType;
  leaderboard: LeaderboardRowType[];
};

export default function ResultsTable({ results, leaderboard }: Props) {
  return (
    <div className={styles.layout}>
      <section className={styles.block}>
        <h2 className={styles.title}>Моя статистика</h2>

        <div className={styles.stats}>
          <div className={styles.statItem}>Игр: {results.stats.gamesCount}</div>
          <div className={styles.statItem}>Очков: {results.stats.totalScore}</div>
          <div className={styles.statItem}>
            Сыграно вопросов: {results.stats.playedQuestions} / {results.stats.totalQuestions}
          </div>
          <div className={styles.statItem}>
            Верных ответов: {results.stats.rightAnswers}
          </div>
        </div>

        <div className={styles.table}>
          <div className={styles.headRow}>
            <span>Игра</span>
            <span>Статус</span>
            <span>Очки</span>
            <span>Вопросы</span>
          </div>

          {results.games.map((game) => (
            <div className={styles.bodyRow} key={game.id}>
              <span>{game.boardTitle}</span>
              <span>{game.status === "finished" ? "Завершена" : "Идёт"}</span>
              <span>{game.score}</span>
              <span>{game.playedQuestions}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <h2 className={styles.title}>Таблица результатов</h2>

        <div className={styles.table}>
          <div className={styles.headRow}>
            <span>Игрок</span>
            <span>Игр</span>
            <span>Очков</span>
          </div>

          {leaderboard.map((row) => (
            <div className={styles.bodyRow} key={row.id}>
              <span>{row.name}</span>
              <span>{row.gamesCount}</span>
              <span>{row.totalScore}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
