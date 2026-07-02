"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { registerThunk } from "@/entities/user/api/UserApiThunk";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";
import {
  SignUpFormType,
  signUpSchema,
} from "@/features/auth/model/authSchemas";
import styles from "../AuthForm.module.css";

export default function SignUpForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function signUpHandler(formData: SignUpFormType) {
    setSubmitError("");

    try {
      await dispatch(registerThunk(formData)).unwrap();
      router.push("/");
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Не удалось зарегистрироваться"));
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(signUpHandler)}>
      <div className={styles.field}>
        <label className={styles.label}>Имя</label>
        <input
          className={styles.input}
          type="text"
          {...register("name", {
            onChange: () => setSubmitError(""),
          })}
        />
        <p className={styles.error}>{errors.name?.message ?? ""}</p>
      </div>

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
        Зарегистрироваться
      </button>
      <p className={styles.formError}>{submitError}</p>
    </form>
  );
}
