"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import SignUpForm from "@/features/auth/ui/SignUpForm/SignUpForm";
import SignInForm from "@/features/auth/ui/SignInForm/SignInForm";
import styles from "./page.module.css";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (user?.id) {
      router.push("/");
    }
  }, [router, user]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Своя игра</h1>
        <p className={styles.text}>
          Войдите или зарегистрируйтесь, чтобы начать игру и сохранять прогресс.
        </p>

        <div className={styles.switcher}>
          <button
            className={isSignUp ? styles.tab : styles.activeTab}
            onClick={() => setIsSignUp(false)}
            type="button"
          >
            Вход
          </button>
          <button
            className={isSignUp ? styles.activeTab : styles.tab}
            onClick={() => setIsSignUp(true)}
            type="button"
          >
            Регистрация
          </button>
        </div>

        {isSignUp ? <SignUpForm /> : <SignInForm />}
      </div>
    </div>
  );
}
