import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Введите корректную почту"),
  password: z.string().min(8, "Пароль должен быть не короче 8 символов"),
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Имя должно быть не короче 2 символов"),
  email: z.email("Введите корректную почту"),
  password: z
    .string()
    .min(8, "Пароль должен быть не короче 8 символов")
    .regex(/[A-Z]/, "Нужна хотя бы одна заглавная буква")
    .regex(/[a-z]/, "Нужна хотя бы одна строчная буква")
    .regex(/\d/, "Нужна хотя бы одна цифра")
    .regex(/[!@#$%^&*()\-+,."<>?{}]/, "Нужен хотя бы один спецсимвол"),
});

export const answerSchema = z.object({
  answer: z.string().trim().min(1, "Введите ответ"),
});

export type SignInFormType = z.infer<typeof signInSchema>;
export type SignUpFormType = z.infer<typeof signUpSchema>;
export type AnswerFormType = z.infer<typeof answerSchema>;
