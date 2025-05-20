import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API slice
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND, // Base URL for API (consistent with your original)
  }),
  tagTypes: ['Blogs', 'Cards', 'Appointments', 'Users', 'Courses', 'ClosedSlots'], // Added 'ClosedSlots'
  endpoints: (builder) => ({
    // Admin Login Endpoint
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/admin/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Fetch the Users
    getUsers: builder.query({
      query: () => '/auth/users',
      providesTags: (result) =>
        Array.isArray(result) && result.length > 0
          ? [
              ...result.map(({ email }) => ({ type: 'Users', id: email })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    // Appointments Endpoints
    getAppointments: builder.query({
      query: () => '/api/appointments',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Appointments', id: _id })),
              { type: 'Appointments', id: 'LIST' },
            ]
          : [{ type: 'Appointments', id: 'LIST' }],
    }),

    addAppointmentData: builder.mutation({
      query: (data) => ({
        url: '/api/appointments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Appointments', id: 'LIST' }],
    }),

    updateAppointmentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/appointments/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Appointments', id },
        { type: 'Appointments', id: 'LIST' },
      ],
    }),

    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `/api/appointments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Appointments', id },
        { type: 'Appointments', id: 'LIST' },
      ],
    }),

    // Closed Slots Endpoints
    getClosedSlots: builder.query({
      query: () => '/api/appointments/closed-slots',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'ClosedSlots', id: _id })),
              { type: 'ClosedSlots', id: 'LIST' },
            ]
          : [{ type: 'ClosedSlots', id: 'LIST' }],
    }),

    closeSlot: builder.mutation({
      query: ({ date, timeSlots }) => ({
        url: '/api/appointments/close',
        method: 'POST',
        body: { date, timeSlots },
      }),
      invalidatesTags: [
        { type: 'ClosedSlots', id: 'LIST' },
        { type: 'Appointments', id: 'LIST' }, // Invalidate appointments to reflect changes
      ],
    }),

    reopenSlot: builder.mutation({
      query: ({ date, timeSlot }) => ({
        url: '/api/appointments/reopen',
        method: 'DELETE',
        body: { date, timeSlot },
      }),
      invalidatesTags: [
        { type: 'ClosedSlots', id: 'LIST' },
        { type: 'Appointments', id: 'LIST' }, // Invalidate appointments to reflect changes
      ],
    }),

    // Blogs Endpoints
    getBlogs: builder.query({
      query: () => '/api/blogs',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Blogs', id: _id })),
              { type: 'Blogs', id: 'LIST' },
            ]
          : [{ type: 'Blogs', id: 'LIST' }],
    }),

    addBlog: builder.mutation({
      query: (formData) => ({
        url: '/api/blogs/new',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Blogs', id: 'LIST' }],
    }),

    updateBlog: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/blogs/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blogs', id },
        { type: 'Blogs', id: 'LIST' },
      ],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/api/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Blogs', id },
        { type: 'Blogs', id: 'LIST' },
      ],
    }),

    // Cards Endpoints
    getCards: builder.query({
      query: () => '/api/cards',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Cards', id: _id })),
              { type: 'Cards', id: 'LIST' },
            ]
          : [{ type: 'Cards', id: 'LIST' }],
    }),

    addCard: builder.mutation({
      query: (formData) => ({
        url: '/api/cards',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Cards', id: 'LIST' }],
    }),

    updateCard: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/cards/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Cards', id },
        { type: 'Cards', id: 'LIST' },
      ],
    }),

    deleteCard: builder.mutation({
      query: (id) => ({
        url: `/api/cards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Cards', id },
        { type: 'Cards', id: 'LIST' },
      ],
    }),

    // Analysis Endpoints
    getBlogAnalysis: builder.query({
      query: () => '/api/blogs/analysis',
      providesTags: ['Blogs'],
    }),

    getCardAnalysis: builder.query({
      query: () => '/api/cards/analysis',
      providesTags: ['Cards'],
    }),

    getAppointmentAnalysis: builder.query({
      query: () => '/api/appointments/analysis',
      providesTags: ['Appointments'],
    }),

    // Courses Endpoints
    getCourses: builder.query({
      query: () => '/api/courses',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Courses', id: _id })),
              { type: 'Courses', id: 'LIST' },
            ]
          : [{ type: 'Courses', id: 'LIST' }],
    }),

    addCourse: builder.mutation({
      query: (formData) => ({
        url: '/api/courses/new',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Courses', id: 'LIST' }],
    }),

    updateCourse: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/courses/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Courses', id },
        { type: 'Courses', id: 'LIST' },
      ],
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/api/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Courses', id },
        { type: 'Courses', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useAdminLoginMutation,
  useGetAppointmentsQuery,
  useAddAppointmentDataMutation, // Added for consistency with your frontend
  useUpdateAppointmentStatusMutation,
  useDeleteAppointmentMutation,
  useGetBlogsQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetCardsQuery,
  useAddCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
  useGetBlogAnalysisQuery,
  useGetCardAnalysisQuery,
  useGetAppointmentAnalysisQuery,
  useGetUsersQuery,
  useGetClosedSlotsQuery, // Added for closed slots
  useCloseSlotMutation,   // Added for closing slots
  useReopenSlotMutation,  // Added for reopening slots
} = api;