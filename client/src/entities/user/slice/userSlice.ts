import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialUserState, type UserType } from "../model";
import {
  loginThunk,
  logoutThunk,
  refreshTokenThunk,
  registerThunk,
} from "../api/UserApiThunk";

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshTokenThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(refreshTokenThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.user = action.payload;
    });
    builder.addCase(refreshTokenThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.user = null;
      state.error = action.payload ?? "Ошибка при обновлении токена";
    });

    builder.addCase(registerThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.user = action.payload;
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.error = action.payload ?? "Ошибка при регистрации";
    });

    builder.addCase(loginThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.user = action.payload;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.error = action.payload ?? "Ошибка при входе в приложение";
    });

    builder.addCase(logoutThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.user = null;
    });
    builder.addCase(logoutThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.error = action.payload ?? "Ошибка при выходе из приложения";
    });
  },
});

export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
