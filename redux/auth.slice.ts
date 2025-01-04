import { User } from "./models/user.model";
import { api } from "./api";
import { CLIENT_ID, CLIENT_SECRET } from "@/env";

export const PASSWORD_REQUIREMENTS =
    "Password must contain at least:\n\n- Eight (8) characters\n- one (1) uppercase letter\n- one (1) lowercase letter\n- one (1) number";

export type AuthResponse = {
    token: string;
    refresh_token: string;
    error: string | undefined;
};

type ClientDataDTO = {
    client_id: string;
    client_secret: string;
    data: any;
};

function createClientDataDTO(data: any): ClientDataDTO {
    return {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        data: data,
    };
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
                    Authorization: `Bearer ${token}`,
                },
            }),
        }),
        updateUser: build.mutation<
            { error: string } | void,
            { user: User; token: string }
        >({
            query: (arg) => ({
                url: "/user/update",
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${arg.token}`,
                },
                body: arg.user,
            }),
        }),
        deleteUser: build.mutation<
            { error: string } | { deleted: number },
            string
        >({
            query: (token: string) => ({
                url: "/user/delete",
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        }),
        refreshToken: build.mutation<AuthResponse, string>({
            query: (refreshToken: string) => ({
                url: "/token/refresh",
                method: "POST",
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
    useUpdateUserMutation,
    useDeleteUserMutation,
    useRefreshTokenMutation,
} = authSlice;
