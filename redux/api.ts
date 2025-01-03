import { API_ENDPOINT } from "@/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: API_ENDPOINT}),
    endpoints: () => ({})
})