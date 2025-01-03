import { User } from "./models/user.model";
import { API_ENDPOINT } from "@/env";
import { api } from "./api";

export type AuthResponse = {
    token: string;
    refresh_token: string;
    error: string | undefined;
};

export const authSlice = api.injectEndpoints({
    endpoints: (build) => ({
        loginUser: build.mutation<AuthResponse, User>({
            query: (user: User) => ({
                url: "/user/login",
                method: "POST",
                body: user,
            }),
        }),
        registerUser: build.mutation<AuthResponse, User>({
            query: (user: User) => ({
                url: "/user/create",
                method: "POST",
                body: user,
            }),
        }),
        getUser: build.query<User, string>({
            query: (token: string) => ({
                url: `/user?token=${token}`,
                method: "GET",
            }),
        }),
        refreshToken: build.mutation<AuthResponse, string>({
            query: (refreshToken: string) => ({
                url: "/token/refresh",
                method: "POST",
                body: {
                    refresh_token: refreshToken,
                },
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useLoginUserMutation,
    useRegisterUserMutation,
    useGetUserQuery,
    useRefreshTokenMutation,
} = authSlice;
