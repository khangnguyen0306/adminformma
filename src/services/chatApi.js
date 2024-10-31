import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BE_API_LOCAL } from "../config";
import { selectTokens } from "../slices/auth.slice";

// Define a service using a base URL and expected endpoints
export const chatApi = createApi({
  reducerPath: "chatManagement",
  // Tag types are used for caching and invalidation.
  tagTypes: ["ChatList"],
  baseQuery: fetchBaseQuery({
    baseUrl: BE_API_LOCAL,

    prepareHeaders: (headers, { getState }) => {
      const token = selectTokens(getState()); 
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      }
      headers.append("Content-Type", "application/json");
      return headers;
    },

}),
  endpoints: (builder) => ({
    createChat: builder.mutation({
      query: (body) => {
        return {
          method: "POST",
          url: `chat/create-room`,
          body,
        };
      },
      invalidatesTags: [{ type: "chat", id: "LIST" }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
// Hooks are auto-generated by RTK-Query
export const {

  useCreateChatMutation,

} = chatApi;