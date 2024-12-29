import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "./models/user.model";
import { API_ENDPOINT } from "@/env";

export const authSlice = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({baseUrl: API_ENDPOINT + "/user"}),
    endpoints: (builder) => ({
        loginUser: builder.mutation<User, User>({
            query: (user: User) => ({
                url: '/login',
                method: 'POST',
                body: user
            })
        }),
        registerUser: builder.mutation<User, User>({
            query: (user: User) => ({
                url: '/create',
                method: 'POST',
                body: user
            })
        })
    })
 });

 export const {
    useLoginUserMutation,
    useRegisterUserMutation
 } = authSlice;