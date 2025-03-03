import { createSlice } from "@reduxjs/toolkit";

const rejectedRequestsSlice = createSlice({
  name: "rejected",
  initialState: {
    data: [],
    totalPages: 1,
    currentPage: 1,
    totalRequest: 0,
  },
  reducers: {
    addRejectedRequests: (state, action) => {
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
    removeRejectedRequest: (state, action) => {
      state.data = state.data.filter(
        (request) => request._id !== action.payload,
      );
    },
    clearRejectedRequests: (state) => {
      state.data = [];
      state.currentPage = 1;
    },
  },
});

export const {
  addRejectedRequests,
  setTotalPages,
  setCurrentPage,
  setTotalRequest,
  removeRejectedRequest,
  clearRejectedRequests,
} = rejectedRequestsSlice.actions;
export default rejectedRequestsSlice.reducer;
