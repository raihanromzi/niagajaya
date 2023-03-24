import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const adminAPI = createApi({
  reducerPath: "adminAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/",
  }),
  endpoints(builder) {
    return {
      getAllAdmin: builder.query({
        query: () => {
          return {
            url: "/admin?role=Admin",
            method: "GET",
          };
        },
      }),
      getAllManager: builder.query({
        query: () => {
          return {
            url: "/admin?role=Manager",
            method: "GET",
          };
        },
      }),
      getAllUser: builder.query({
        query: () => {
          return {
            url: "/admin?role=User",
            method: "GET",
          };
        },
      }),
      crateAdmin: builder.mutation({
        query: (data) => {
          return {
            url: "/admin",
            method: "POST",
            body: {
              email: data.email,
              name: data.name,
              password: data.password,
            },
          };
        },
      }),
      updateAdmin: builder.mutation({
        query: (data) => {
          return {
            url: "/admin",
            method: "PUT",
            params: {
              id: data.id,
            },
            body: {
              email: data.email,
              name: data.name,
              newName: data.newName,
            },
          };
        },
      }),
      deleteAdmin: builder.mutation({
        query: (id) => {
          return {
            url: "/admin",
            method: "DELETE",
            params: {
              id: id,
            },
          };
        },
      }),
    };
  },
});

export const { useGetAllAdminQuery, useGetAllManagerQuery, useGetAllUserQuery, useCrateAdminMutation, useUpdateAdminMutation, useDeleteAdminMutation } = adminAPI;
export { adminAPI };
