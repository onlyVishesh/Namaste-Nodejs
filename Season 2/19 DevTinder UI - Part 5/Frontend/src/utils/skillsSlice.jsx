import { createSlice } from "@reduxjs/toolkit";
const skillsSlice = createSlice({
  name: "skills",
  initialState: {},
  reducers: {
    cacheResults: (state, action) => {
      state = Object.assign(state, action.payload);
    },
  },
});

export const { cacheResults } = skillsSlice.actions;
export default skillsSlice.reducer;
