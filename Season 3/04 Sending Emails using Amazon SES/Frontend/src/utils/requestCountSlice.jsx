import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
const initialState = {
  requestCount: null,
  loading: false,
  error: null,
};

// Create an async thunk for fetching the request count
export const fetchRequestCount = createAsyncThunk(
  "requestCount/fetchRequestCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BackendURL + "/user/totalStatus",
        { withCredentials: true },
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "An error occurred");
      }
      return response.data.requestCount;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  },
);

const requestCountSlice = createSlice({
  name: "requestCount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestCount.fulfilled, (state, action) => {
        state.loading = false;
        state.requestCount = action.payload;
      })
      .addCase(fetchRequestCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default requestCountSlice.reducer;
