"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OpenedQuestionType } from "@/entities/game/model/types";
import {
  AnswerFormType,
  answerSchema,
} from "@/features/auth/model/authSchemas";
import styles from "./QuestionModal.module.css";

type Props = {
  question: OpenedQuestionType | null;
  isSending: boolean;
  onClose: () => void;
  onSendAnswer: (answer: string) => Promise<void>;
};

export default function QuestionModal({
  question,
  isSending,
  onClose,
  onSendAnswer,
}: Props) {
  const [now, setNow] = useState(0);
  const isAutoSendingRef = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnswerFormType>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      answer: "",
    },
  });

  useEffect(() => {
    reset({ answer: "" });
    isAutoSendingRef.current = false;
  }, [question, reset]);

  useEffect(() => {
    if (!question) {
      return;
    }

    const timerId = window.setInterval(() => {
      setNow(Date.now());
    }, 300);

    return () => window.clearInterval(timerId);
  }, [question]);

  const timeLeft = question
    ? now === 0
      ? question.timeLimitSec
      : Math.max(0, Math.ceil((new Date(question.deadlineAt).getTime() - now) / 1000))
    : 0;

  useEffect(() => {
    if (!question || timeLeft > 0 || isAutoSendingRef.current) {
      return;
    }

    isAutoSendingRef.current = true;
    onClose();
    void onSendAnswer("");
  }, [question, timeLeft, onClose, onSendAnswer]);

  if (!question) {
    return null;
  }

  async function submitHandler(formData: AnswerFormType) {
    await onSendAnswer(formData.answer);
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose} type="button">
          X
        </button>

        <p className={styles.price}>Вопрос за {question.price}</p>
        <h2 className={styles.title}>Ответьте на вопрос</h2>
        <p className={styles.question}>{question.text}</p>

        <div className={styles.timer}>
          Осталось времени: <strong>{timeLeft}</strong> сек.
        </div>

        <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
          <input
            className={styles.input}
            type="text"
            placeholder="Введите ответ"
            {...register("answer")}
          />
          <p className={styles.error}>{errors.answer?.message ?? ""}</p>

          <button className={styles.button} disabled={isSending}>
            {isSending ? "Проверяем..." : "Ответить"}
          </button>
        </form>
      </div>
    </div>
  );
}
