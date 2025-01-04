import { User } from "./models/user.model";
import { api } from "./api";
import { CLIENT_ID, CLIENT_SECRET } from "@/env";

export type AuthResponse = {
    token: string;
    refresh_token: string;
    error: string | undefined;
};

type ClientDataDTO = {
    client_id: string;
    client_secret: string;
    data: any
}

function createClientDataDTO(data: any): ClientDataDTO {
    return {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        data: data
    }
}

export const authSlice = api.injectEndpoints({
    endpoints: (build) => ({
        loginUser: build.mutation<AuthResponse, User>({
            query: (user: User) => ({
                url: "/user/login",
                method: "POST",
                body: createClientDataDTO(user),
            }),
        }),
        registerUser: build.mutation<AuthResponse, User>({
            query: (user: User) => ({
                url: "/user/create",
                method: "POST",
                body: createClientDataDTO(user),
            }),
        }),
        getUser: build.query<User, string>({
            query: (token: string) => ({
                url: `/user`,
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }),
        }),
        updateUser: build.mutation<void, {user: User, token: string}>({
            query: (arg) => ({
                url: "/user/update",
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${arg.token}`
                },
                body: arg.user
            })
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
    useUpdateUserMutation,
    useRefreshTokenMutation,
} = authSlice;
