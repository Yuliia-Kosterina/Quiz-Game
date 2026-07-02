"use client";
import type { MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { logoutThunk } from "@/entities/user/api/UserApiThunk";
import styles from "./Header.module.css";

export default function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);

  async function handleLogout(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    await dispatch(logoutThunk());
    router.push("/auth");
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <Link href="/" className={styles.link}>
            Главная
          </Link>
          <Link href="/game" className={styles.link}>
            Игра
          </Link>
          <Link href="/results" className={styles.link}>
            Результаты
          </Link>
        </div>

        <div className={styles.right}>
          {user?.id ? (
            <>
              <span className={styles.userName}>{user.name}</span>
              <Link href="/auth" className={styles.link} onClick={handleLogout}>
                Выход
              </Link>
            </>
          ) : (
            <Link href="/auth" className={styles.link}>
              Вход
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
