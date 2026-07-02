"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStartGameMutation } from "@/entities/game/api/quizApi";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";
import styles from "./StartGameButton.module.css";

export default function StartGameButton() {
  const router = useRouter();
  const [startGame, { isLoading }] = useStartGameMutation();
  const [submitError, setSubmitError] = useState("");

  async function handleStartGame() {
    setSubmitError("");

    try {
      await startGame().unwrap();
      router.push("/game");
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Не удалось начать игру"));
    }
  }

  return (
    <div className={styles.wrapper}>
      <button className={styles.button} onClick={handleStartGame} disabled={isLoading}>
        {isLoading ? "Подготовка..." : "Начать игру"}
      </button>
      <p className={styles.error}>{submitError}</p>
    </div>
  );
}
