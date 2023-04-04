import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const adminAPI = createApi({
  reducerPath: "adminAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/",
  }),
  endpoints(builder) {
    return {
      getAllAdmin: builder.query({
        query: (page, limit) => {
          return {
            url: `/admin?role=Admin&page=${page ? page : 1}&limit=${limit ? limit : 5}`,
            method: "GET",
          };
        },
        providesTags: ["Admin"],
      }),
      getAllManager: builder.query({
        query: () => {
          return {
            url: "/admin?role=Manager",
            method: "GET",
          };
        },
        providesTags: ["Manager"],
      }),
      getAllUser: builder.query({
        query: () => {
          return {
            url: "/admin?role=User",
            method: "GET",
          };
        },
        providesTags: ["User"],
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
        invalidatesTags: ["Admin"],
      }),
      updateAdmin: builder.mutation({
        query: (data) => {
          return {
            url: `/admin/${data.id}`,
            method: "PUT",
            body: {
              email: data.email,
              name: data.name,
              newName: data.newName,
            },
          };
        },
        invalidatesTags: ["Admin"],
      }),
      deleteAdmin: builder.mutation({
        query: (id) => {
          return {
            url: `/admin/${id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["Admin"],
      }),
    };
  },
});

export const { useGetAllAdminQuery, useGetAllManagerQuery, useGetAllUserQuery, useCrateAdminMutation, useUpdateAdminMutation, useDeleteAdminMutation } = adminAPI;
export { adminAPI };
