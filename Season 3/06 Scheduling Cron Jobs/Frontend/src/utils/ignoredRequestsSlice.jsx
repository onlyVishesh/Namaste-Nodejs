import { createSlice } from "@reduxjs/toolkit";

const ignoredRequestsSlice = createSlice({
  name: "ignored",
  initialState: {
    data: [],
    totalPages: 1,
    currentPage: 1,
    totalRequest: 0,
  },
  reducers: {
    addIgnoredRequests: (state, action) => {
      const newRequests = action.payload.filter(
        (request) => !state.data.some((item) => item._id === request._id),
      );
      state.data.push(...newRequests);
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalRequest: (state, action) => {
      state.totalRequest = action.payload;
    },
    removeIgnoredRequest: (state, action) => {
      state.data = state.data.filter(
        (request) => request._id !== action.payload,
      );
    },
    clearIgnoredRequests: (state) => {
      state.data = [];
      state.currentPage = 1;
    },
  },
});

export const {
  addIgnoredRequests,
  setTotalPages,
  setCurrentPage,
  setTotalRequest,
  removeIgnoredRequest,
  clearIgnoredRequests,
} = ignoredRequestsSlice.actions;
export default ignoredRequestsSlice.reducer;
