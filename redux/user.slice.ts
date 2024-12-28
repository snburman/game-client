import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "./models/user.model";
import { API_ENDPOINT } from "@/env";

export const userSlice = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({baseUrl: API_ENDPOINT + "/user"}),
    endpoints: (builder) => ({
        loginUser: builder.mutation<User, User>({
            query: (user: User) => ({
                url: `/user/login?email=${user.email}`
            })
        })
    })
 })