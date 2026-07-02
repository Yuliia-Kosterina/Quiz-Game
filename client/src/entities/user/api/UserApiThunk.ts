import { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, setAccessToken } from "@/shared/lib/axiosInstance";
import type { ServerResponseType } from "@/shared/types";
import type {
  UserLoginData,
  UserRegisterData,
  UserType,
  UserWithTokenType,
} from "../model";

const USER_THUNK_NAMES = {
  REGISTER: "user/register",
  LOGIN: "user/login",
  REFRESH: "user/refresh",
  LOGOUT: "user/logout",
} as const;

const USER_API_URLS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
} as const;

function getServerMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const messageFromServer = (error.response?.data as { message?: string } | undefined)
      ?.message;

    return messageFromServer ?? error.message ?? fallback;
  }

  return fallback;
}

export const refreshTokenThunk = createAsyncThunk<
  UserType,
  void,
  { rejectValue: string }
>(USER_THUNK_NAMES.REFRESH, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<ServerResponseType<UserWithTokenType>>(
      USER_API_URLS.REFRESH,
    );

    if (data.statusCode === 200 && data.data?.user) {
      setAccessToken(data.data.accessToken);
      return data.data.user;
    }

    return rejectWithValue(data.message ?? "Ошибка при обновлении токена");
  } catch (error) {
    return rejectWithValue(getServerMessage(error, "Ошибка при обновлении токена"));
  }
});

export const registerThunk = createAsyncThunk<
  UserType,
  UserRegisterData,
  { rejectValue: string }
>(USER_THUNK_NAMES.REGISTER, async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<ServerResponseType<UserWithTokenType>>(
      USER_API_URLS.REGISTER,
      userData,
    );

    if (data.statusCode === 201 && data.data?.user) {
      setAccessToken(data.data.accessToken);
      return data.data.user;
    }

    return rejectWithValue(data.message ?? "Ошибка при регистрации");
  } catch (error) {
    return rejectWithValue(getServerMessage(error, "Ошибка при регистрации"));
  }
});

export const loginThunk = createAsyncThunk<
  UserType,
  UserLoginData,
  { rejectValue: string }
>(USER_THUNK_NAMES.LOGIN, async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<ServerResponseType<UserWithTokenType>>(
      USER_API_URLS.LOGIN,
      userData,
    );

    if (data.statusCode === 200 && data.data?.user) {
      setAccessToken(data.data.accessToken);
      return data.data.user;
    }

    return rejectWithValue(data.message ?? "Ошибка при входе в приложение");
  } catch (error) {
    return rejectWithValue(getServerMessage(error, "Ошибка при входе в приложение"));
  }
});

export const logoutThunk = createAsyncThunk<
  null,
  void,
  { rejectValue: string }
>(USER_THUNK_NAMES.LOGOUT, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<ServerResponseType<null>>(
      USER_API_URLS.LOGOUT,
    );

    if (data.statusCode === 200) {
      setAccessToken("");
      return null;
    }

    return rejectWithValue(data.message ?? "Ошибка при выходе из приложения");
  } catch (error) {
    return rejectWithValue(getServerMessage(error, "Ошибка при выходе из приложения"));
  }
});
