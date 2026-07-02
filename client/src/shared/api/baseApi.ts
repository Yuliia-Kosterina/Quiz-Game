import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { ServerResponseType } from "@/shared/types";
import type { UserWithTokenType } from "@/entities/user/model";
import { getAccessToken, setAccessToken } from "@/shared/lib/axiosInstance";
import { setUser } from "@/entities/user/slice/userSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/api`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getAccessToken();

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Если access token истёк, пробуем обновить его через refresh cookie.
const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 403) {
    const refreshResult = await rawBaseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult.data) {
      const refreshData = refreshResult.data as ServerResponseType<UserWithTokenType>;

      if (refreshData.data?.accessToken && refreshData.data.user) {
        setAccessToken(refreshData.data.accessToken);
        api.dispatch(setUser(refreshData.data.user));
        result = await rawBaseQuery(args, api, extraOptions);
      }
    } else {
      setAccessToken("");
      api.dispatch(setUser(null));
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Game", "Results", "Leaderboard"],
  endpoints: () => ({}),
});
