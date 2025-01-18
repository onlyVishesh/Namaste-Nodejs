import { createSlice } from "@reduxjs/toolkit";

const rejectedRequestsSlice = createSlice({
  name: "rejectedRequests",
  initialState: [],
  reducers: {
    addRejectedRequests: (state, action) => {
      const newRequests = action.payload.filter(
        (request) => !state.some((item) => item._id === request._id),
      );
      state.push(...newRequests);
    },
    removeRejectedRequest: (state, action) => {
      const idToRemove = action.payload;
      return state.filter((request) => request._id !== idToRemove);
    },
    clearRejectedRequests: () => {
      return [];
    },
  },
});

export const {
  addRejectedRequests,
  removeRejectedRequest,
  clearRejectedRequests,
} = rejectedRequestsSlice.actions;
export default rejectedRequestsSlice.reducer;
