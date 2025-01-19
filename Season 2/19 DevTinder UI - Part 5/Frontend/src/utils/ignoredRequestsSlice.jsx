import { createSlice } from "@reduxjs/toolkit";

const ignoredRequestsSlice = createSlice({
  name: "ignoredRequests",
  initialState: [],
  reducers: {
    addIgnoredRequests: (state, action) => {
      const newRequests = action.payload.filter(
        (request) => !state.some((item) => item._id === request._id),
      );
      state.push(...newRequests);
    },
    removeIgnoredRequest: (state, action) => {
      const idToRemove = action.payload;
      return state.filter((request) => request._id !== idToRemove);
    },
    clearIgnoredRequests: () => {
      return [];
    },
  },
});

export const {
  addIgnoredRequests,
  removeIgnoredRequest,
  clearIgnoredRequests,
} = ignoredRequestsSlice.actions;
export default ignoredRequestsSlice.reducer;
