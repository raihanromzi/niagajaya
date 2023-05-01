import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const adminAPI = createApi({
  reducerPath: "adminAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/",
  }),
  endpoints(builder) {
    return {
      getAllAdmin: builder.query({
        async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
          return await fetchWithBQ(
            `/admin?role=Admin&page=${_arg.page || 1}&limit=${
              _arg.limit || 5
            }&name=${_arg.search[0] || ""}&sortBy=${_arg.sort || "latest"}`,
          );
        },
        providesTags: ["Admin"],
      }),

      getAllManager: builder.query({
        async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
          return await fetchWithBQ(
            `/admin?role=Manager&page=${_arg.page || 1}&limit=${
              _arg.limit || 5
            }&name=${_arg.search[0] || ""}&sortBy=${_arg.sort || "latest"}`,
          );
        },
        providesTags: ["Manager"],
      }),
      getAllUser: builder.query({
        async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
          return await fetchWithBQ(
            `/admin?role=User&page=${_arg.page || 1}&limit=${
              _arg.limit || 5
            }&name=${_arg.search[0] || ""}&sortBy=${_arg.sort || "latest"}`,
          );
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

export const {
  useGetAllAdminQuery,
  useGetAllManagerQuery,
  useGetAllUserQuery,
  useCrateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminAPI;
export { adminAPI };
