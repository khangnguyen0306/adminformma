import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BE_API_LOCAL } from "../config";
import { selectTokens } from "../slices/auth.slice";

export const orderApi = createApi({
  reducerPath: "orderManagement",
  tagTypes: ["OrderList"],
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
    getAllOrder: builder.query({
      query: () => `orders`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "OrderList", id })),
              { type: "OrderList", id: "LIST" },
            ]
          : [{ type: "OrderList", id: "LIST" }],
    }),
    getOrderDetail: builder.query({
      query: (orderId) => ({
        url: `orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (result, error, orderId) => [{ type: "OrderList", id: orderId }],
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: `orders`,
        body,
      }),
      invalidatesTags: [{ type: "OrderList", id: "LIST" }],
    }),
    editOrder: builder.mutation({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `orders/${id}`,
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "OrderList", id }],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `orders/${id}`,
      }),
      invalidatesTags: [{ type: "OrderList", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllOrderQuery,
  useGetOrderDetailQuery,
  useCreateOrderMutation,
  useEditOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
