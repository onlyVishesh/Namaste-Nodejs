import { createSlice } from "@reduxjs/toolkit";

const followersSlice = createSlice({
  name: "ignoredRequests",
  initialState: [],
  reducers: {
    addFollowerRequests: (state, action) => {
      const newRequests = action.payload.filter(
        (request) => !state.some((item) => item._id === request._id),
      );
      state.push(...newRequests);
    },
    removeFollowerRequest: (state, action) => {
      const idToRemove = action.payload;
      return state.filter((request) => request._id !== idToRemove);
    },
    clearFollowerRequests: () => {
      return [];
    },
  },
});

export const {
  addFollowerRequests,
  removeFollowerRequest,
  clearFollowerRequests,
} = followersSlice.actions;
export default followersSlice.reducer;
