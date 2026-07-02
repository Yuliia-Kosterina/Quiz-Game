import { baseApi } from "@/shared/api/baseApi";
import type { ServerResponseType } from "@/shared/types";
import type {
  AnswerResponseType,
  GameType,
  LeaderboardRowType,
  MyResultsType,
  OpenQuestionResponseType,
} from "../model/types";

export const quizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentGame: builder.query<ServerResponseType<GameType | null>, void>({
      query: () => "/games/current",
      providesTags: ["Game"],
    }),

    startGame: builder.mutation<ServerResponseType<GameType>, void>({
      query: () => ({
        url: "/games",
        method: "POST",
      }),
      invalidatesTags: ["Game", "Results", "Leaderboard"],
    }),

    finishGame: builder.mutation<ServerResponseType<GameType>, { gameId: number }>({
      query: ({ gameId }) => ({
        url: `/games/${gameId}/finish`,
        method: "POST",
      }),
      invalidatesTags: ["Game", "Results", "Leaderboard"],
    }),

    openQuestion: builder.mutation<
      ServerResponseType<OpenQuestionResponseType>,
      { gameId: number; questionId: number }
    >({
      query: ({ gameId, questionId }) => ({
        url: `/games/${gameId}/questions/${questionId}/open`,
        method: "POST",
      }),
      invalidatesTags: ["Game"],
    }),

    answerQuestion: builder.mutation<
      ServerResponseType<AnswerResponseType>,
      { gameId: number; questionId: number; answer: string }
    >({
      query: ({ gameId, questionId, answer }) => ({
        url: `/games/${gameId}/questions/${questionId}/answer`,
        method: "POST",
        body: { answer },
      }),
      invalidatesTags: ["Game", "Results", "Leaderboard"],
    }),

    getMyResults: builder.query<ServerResponseType<MyResultsType>, void>({
      query: () => "/results/me",
      providesTags: ["Results"],
    }),

    getLeaderboard: builder.query<ServerResponseType<LeaderboardRowType[]>, void>({
      query: () => "/results/leaderboard",
      providesTags: ["Leaderboard"],
    }),
  }),
});

export const {
  useGetCurrentGameQuery,
  useStartGameMutation,
  useFinishGameMutation,
  useOpenQuestionMutation,
  useAnswerQuestionMutation,
  useGetMyResultsQuery,
  useGetLeaderboardQuery,
} = quizApi;
