// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Image } from './models/image.model'

// Define a service using a base URL and expected endpoints
export const imageSlice = createApi({
  reducerPath: 'imageApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9191/game' }),
  endpoints: (builder) => ({
    getImage: builder.query<Image, string>({
      query: (name) => `pokemon/${name}`,
    }),
    postImage: builder.mutation<Image, Image>({
      query: (newImage: Image) => ({
        url: `/player/assets`,
        method: 'POST',
        body: newImage,
      }),
    }),
  }),
})

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetImageQuery } = imageSlice