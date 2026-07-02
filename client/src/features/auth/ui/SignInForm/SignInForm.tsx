"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { loginThunk } from "@/entities/user/api/UserApiThunk";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";
import {
  SignInFormType,
  signInSchema,
} from "@/features/auth/model/authSchemas";
import styles from "../AuthForm.module.css";

export default function SignInForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function signInHandler(formData: SignInFormType) {
    setSubmitError("");

    try {
      await dispatch(loginThunk(formData)).unwrap();
      router.push("/");
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Не удалось войти"));
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(signInHandler)}>
      <div className={styles.field}>
        <label className={styles.label}>Почта</label>
        <input
          className={styles.input}
          type="email"
          {...register("email", {
            onChange: () => setSubmitError(""),
          })}
        />
        <p className={styles.error}>{errors.email?.message ?? ""}</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Пароль</label>
        <input
          className={styles.input}
          type="password"
          {...register("password", {
            onChange: () => setSubmitError(""),
          })}
        />
        <p className={styles.error}>{errors.password?.message ?? ""}</p>
      </div>

      <button className={styles.button} disabled={isSubmitting}>
        Войти
      </button>
      <p className={styles.formError}>{submitError}</p>
    </form>
  );
}
