import { configureStore } from "@reduxjs/toolkit";
import connectionsReducer from "./connectionsSlice";
import feedReducer from "./feedSlice";
import ignoredRequestsReducer from "./ignoredRequestsSlice";
import interestedRequestsReducer from "./interestedRequestsSlice";
import requestCountReducer from "./requestCountSlice";
import userReducer from "./userSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    requestCount: requestCountReducer,
    interestedRequests: interestedRequestsReducer,
    connections: connectionsReducer,
    ignoredRequests: ignoredRequestsReducer,
  },
});

export default appStore;
