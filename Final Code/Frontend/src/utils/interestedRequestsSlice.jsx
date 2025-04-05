import { createSlice } from "@reduxjs/toolkit";

const interestedRequestsSlice = createSlice({
  name: "interested",
  initialState: {
    data: [],
    totalPages: 1,
    currentPage: 1,
    totalRequest: 0,
  },
  reducers: {
    addInterestedRequests: (state, action) => {
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
    removeInterestedRequest: (state, action) => {
      state.data = state.data.filter(
        (request) => request._id !== action.payload,
      );
    },
    clearInterestedRequests: (state) => {
      state.data = [];
      state.currentPage = 1;
    },
  },
});

export const {
  addInterestedRequests,
  setTotalPages,
  setCurrentPage,
  setTotalRequest,
  removeInterestedRequest,
  clearInterestedRequests,
} = interestedRequestsSlice.actions;
export default interestedRequestsSlice.reducer;
