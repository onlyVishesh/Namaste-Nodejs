import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "./feedSlice";
import ignoredRequestsSlice from "./ignoredRequestsSlice";
import interestedRequestsSlice from "./interestedRequestsSlice";
import requestCountReducer from "./requestCountSlice";
import userReducer from "./userSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    requestCount: requestCountReducer,
    interestedRequests: interestedRequestsSlice,
    ignoredRequests: ignoredRequestsSlice,
  },
});

export default appStore;
