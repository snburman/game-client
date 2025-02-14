import { User } from "./models/user.model";
import { api, AuthToken } from "./api";
import { CLIENT_ID, CLIENT_SECRET } from "@/env";

export enum AuthError {
    InvalidCredentials = "invalid_credentials",
    WeakPassword = "weak_password",
    UserExists = "user_exists",
    UserBanned = "user_banned",
}

export const PASSWORD_REQUIREMENTS =
    "Password must contain at least:\n\n- Eight (8) characters\n- one (1) uppercase letter\n- one (1) lowercase letter\n- one (1) number";

export type AuthResponse = {
    token: string;
    refresh_token: string;
    error: string | undefined;
};

type ClientDataDTO = {
    data: any;
};

function createClientDataDTO<T>(data: T): ClientDataDTO {
    return {
        data: data,
    };
}

function createClientAuthHeaders() {
    return {
        "CLIENT_ID": CLIENT_ID,
        "CLIENT_SECRET": CLIENT_SECRET
    }
}



export const authSlice = api.injectEndpoints({
    endpoints: (build) => ({
        loginUser: build.mutation<AuthResponse, User>({
            query: (user) => ({
                url: "/user/login",
                method: "POST",
                headers: createClientAuthHeaders(),
                body: createClientDataDTO(user),
            }),
        }),
        registerUser: build.mutation<AuthResponse, User>({
            query: (user) => ({
                url: "/user/create",
                method: "POST",
                headers: createClientAuthHeaders(),
                body: createClientDataDTO(user),
            }),
        }),
        getUser: build.query<User, string>({
            query: (token) => ({
                url: `/user`,
                method: "GET",
                headers: {
                    ...AuthToken(token),
                },
            }),
        }),
        updateUser: build.mutation<
            { error: string } | void,
            { user: User; token: string }
        >({
            query: (args) => ({
                url: "/user/update",
                method: "PATCH",
                headers: {
                    ...AuthToken(args.token),
                },
                body: args.user,
            }),
        }),
        deleteUser: build.mutation<
            { error: string } | { deleted: number },
            string
        >({
            query: (token) => ({
                url: "/user/delete",
                method: "DELETE",
                headers: {
                    ...AuthToken(token),
                },
            }),
        }),
        refreshToken: build.mutation<AuthResponse, string>({
            query: (refreshToken) => ({
                url: "/token/refresh",
                method: "POST",
                headers: createClientAuthHeaders(),
                body: createClientDataDTO(refreshToken),
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useLoginUserMutation,
    useRegisterUserMutation,
    useGetUserQuery,
    useLazyGetUserQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useRefreshTokenMutation,
} = authSlice;
