import { createSlice } from "@reduxjs/toolkit";

const interestedRequestsSlice = createSlice({
  name: "interestedRequests",
  initialState: [],
  reducers: {
    addInterestedRequests: (state, action) => {
      const newRequests = action.payload.filter(
        (request) => !state.some((item) => item._id === request._id),
      );
      state.push(...newRequests);
    },
    removeInterestedRequest: (state, action) => {
      const idToRemove = action.payload;
      return state.filter((request) => request._id !== idToRemove);
    },
    clearInterestedRequests: () => {
      return [];
    },
  },
});

export const {
  addInterestedRequests,
  removeInterestedRequest,
  clearInterestedRequests,
} = interestedRequestsSlice.actions;
export default interestedRequestsSlice.reducer;
