import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
  name: "connections",
  initialState: [],
  reducers: {
    addConnectionRequests: (state, action) => {
      const newRequests = action.payload.filter(
        (request) => !state.some((item) => item._id === request._id),
      );
      state.push(...newRequests);
    },
    removeConnectionRequest: (state, action) => {
      const idToRemove = action.payload;
      return state.filter((request) => request._id !== idToRemove);
    },
    clearConnectionRequests: () => {
      return [];
    },
  },
});

export const {
  addConnectionRequests,
  removeConnectionRequest,
  clearConnectionRequests,
} = connectionsSlice.actions;
export default connectionsSlice.reducer;
