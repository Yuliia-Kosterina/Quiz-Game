"use client";
import Link from "next/link";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import { useGetCurrentGameQuery } from "@/entities/game/api/quizApi";
import StartGameButton from "@/features/game/ui/StartGameButton";
import styles from "./page.module.css";

export default function HomePage() {
  const user = useAppSelector((state) => state.user.user);
  const isInitialized = useAppSelector((state) => state.user.isInitialized);
  const { data } = useGetCurrentGameQuery(undefined, {
    skip: !user,
  });

  if (!isInitialized) {
    return <div className={styles.state}>Проверяю сессию...</div>;
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Веб-версия игры <span>«Своя игра»</span>
        </h1>
        <p className={styles.text}>
          Игрок выбирает тему и стоимость вопроса, отвечает в модальном окне,
          получает или теряет очки, а весь прогресс сохраняется на сервере
        </p>

        <div className={styles.buttons}>
          {!user ? (
            <>
              <Link className={styles.button} href="/auth">
                Войти в систему
              </Link>
              <Link className={styles.ghostButton} href="/results">
                Смотреть результаты
              </Link>
            </>
          ) : data?.data ? (
            <>
              <Link className={styles.button} href="/game">
                Продолжить игру
              </Link>
              <Link className={styles.ghostButton} href="/results">
                Мои результаты
              </Link>
            </>
          ) : (
            <>
              <StartGameButton />
              <Link className={styles.ghostButton} href="/results">
                Мои результаты
              </Link>
            </>
          )}
        </div>
      </section>

  
        <div className={styles.miniCard}>
          <h3 className={styles.miniTitle}>Как работает счёт</h3>
          <p className={styles.miniText}>
            Верный ответ добавляет цену вопроса, неверный ответ или таймаут
            отнимает эту же сумму
          </p>
        </div>
     
    </div>
  );
}
