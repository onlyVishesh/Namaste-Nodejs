import { createSlice } from "@reduxjs/toolkit";

const followingSlice = createSlice({
  name: "followingRequests",
  initialState: [],
  reducers: {
    addFollowingRequests: (state, action) => {
      const newRequests = action.payload.filter(
        (request) => !state.some((item) => item._id === request._id),
      );
      state.push(...newRequests);
    },
    removeFollowingRequest: (state, action) => {
      const idToRemove = action.payload;
      return state.filter((request) => request._id !== idToRemove);
    },
    clearFollowingRequests: () => {
      return [];
    },
  },
});

export const {
  addFollowingRequests,
  removeFollowingRequest,
  clearFollowingRequests,
} = followingSlice.actions;
export default followingSlice.reducer;
