import { createSlice } from "@reduxjs/toolkit";

const followersSlice = createSlice({
  name: "followers",
  initialState: {
    data: [],
    totalPages: 1,
    currentPage: 1,
    totalRequest: 0,
  },
  reducers: {
    addFollowerRequests: (state, action) => {
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
    removeFollowerRequest: (state, action) => {
      state.data = state.data.filter(
        (request) => request._id !== action.payload,
      );
    },
    clearFollowerRequests: (state) => {
      state.data = [];
      state.currentPage = 1;
    },
  },
});

export const {
  addFollowerRequests,
  setTotalPages,
  setCurrentPage,
  setTotalRequest,
  removeFollowerRequest,
  clearFollowerRequests,
} = followersSlice.actions;
export default followersSlice.reducer;
