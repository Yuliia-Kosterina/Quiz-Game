"use client";
import Link from "next/link";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import {
  useGetLeaderboardQuery,
  useGetMyResultsQuery,
} from "@/entities/game/api/quizApi";
import ResultsTable from "@/widgets/ResultsTable/ResultsTable";
import styles from "./page.module.css";

export default function ResultsPage() {
  const user = useAppSelector((state) => state.user.user);
  const isInitialized = useAppSelector((state) => state.user.isInitialized);

  const { data: myResults, isLoading: isLoadingResults } = useGetMyResultsQuery(
    undefined,
    {
      skip: !user,
    },
  );
  const { data: leaderboard, isLoading: isLoadingLeaderboard } =
    useGetLeaderboardQuery(undefined, {
      skip: !user,
    });

  if (!isInitialized) {
    return <div className={styles.state}>Проверяем сессию...</div>;
  }

  if (!user) {
    return (
      <div className={styles.state}>
        <p>Раздел результатов доступен только после входа.</p>
        <Link className={styles.link} href="/auth">
          Перейти ко входу
        </Link>
      </div>
    );
  }

  if (isLoadingResults || isLoadingLeaderboard) {
    return <div className={styles.state}>Загружаем результаты...</div>;
  }

  if (!myResults?.data || !leaderboard?.data) {
    return <div className={styles.state}>Не удалось загрузить результаты.</div>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Результаты игроков</h1>
      <ResultsTable results={myResults.data} leaderboard={leaderboard.data} />
    </div>
  );
}
