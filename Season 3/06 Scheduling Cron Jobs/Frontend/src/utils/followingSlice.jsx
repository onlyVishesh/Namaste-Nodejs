import { createSlice } from "@reduxjs/toolkit";

const followingSlice = createSlice({
  name: "following",
  initialState: { data: [], totalPages: 1, currentPage: 1, totalRequest: 0 },
  reducers: {
    addFollowingRequests: (state, action) => {
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
    removeFollowingRequest: (state, action) => {
      state.data = state.data.filter(
        (request) => request._id !== action.payload,
      );
    },
    clearFollowingRequests: (state) => {
      state.data = [];
      state.currentPage = 1;
    },
  },
});

export const {
  addFollowingRequests,
  setTotalPages,
  setCurrentPage,
  setTotalRequest,
  removeFollowingRequest,
  clearFollowingRequests,
} = followingSlice.actions;
export default followingSlice.reducer;
