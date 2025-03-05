import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
  name: "connections",
  initialState: {
    data: [],
    totalPages: 1,
    currentPage: 1,
    totalRequest: 0,
  },
  reducers: {
    addConnectionRequests: (state, action) => {
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
    removeConnectionRequest: (state, action) => {
      state.data = state.data.filter(
        (request) => request._id !== action.payload,
      );
    },
    clearConnectionRequests: (state) => {
      state.data = [];
      state.currentPage = 1;
    },
  },
});

export const {
  addConnectionRequests,
  setTotalPages,
  setCurrentPage,
  setTotalRequest,
  removeConnectionRequest,
  clearConnectionRequests,
} = connectionsSlice.actions;
export default connectionsSlice.reducer;
