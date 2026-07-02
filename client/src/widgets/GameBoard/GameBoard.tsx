"use client";
import type { GameType } from "@/entities/game/model/types";
import styles from "./GameBoard.module.css";

type Props = {
  game: GameType;
  onSelect: (questionId: number) => void;
  disabled: boolean;
};

export default function GameBoard({ game, onSelect, disabled }: Props) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.board}>
        {game.board.categories.map((category) => (
          <div className={styles.row} key={category.id}>
            <div className={styles.category}>{category.title}</div>

            {category.questions.map((question) => {
              const isPlayed =
                question.status === "answered" || question.status === "timed_out";

              return (
                <button
                  key={question.id}
                  className={`${styles.cell} ${
                    isPlayed ? styles.played : styles.available
                  } ${question.status === "opened" ? styles.opened : ""}`}
                  disabled={disabled || isPlayed}
                  onClick={() => onSelect(question.id)}
                >
                  {isPlayed ? "—" : question.price}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
