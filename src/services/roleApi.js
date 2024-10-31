import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BE_API_LOCAL } from "../config";
import { selectTokens } from "../slices/auth.slice";

export const roleApi = createApi({
  reducerPath: "roleManagement",
  tagTypes: ["RoleList"],
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
    getAllRole: builder.query({
      query: () => `roles`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "RoleList", id })),
              { type: "RoleList", id: "LIST" },
            ]
          : [{ type: "RoleList", id: "LIST" }],
    }),
    createRole: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: `roles`,
        body,
      }),
      invalidatesTags: [{ type: "RoleList", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllRoleQuery,
  useCreateRoleMutation,
} = roleApi;
