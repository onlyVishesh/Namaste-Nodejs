import { configureStore } from "@reduxjs/toolkit";
import connectionsReducer from "./connectionsSlice";
import feedReducer from "./feedSlice";
import followersReducer from "./followersSlice";
import followingReducer from "./followingSlice";
import ignoredRequestsReducer from "./ignoredRequestsSlice";
import interestedRequestsReducer from "./interestedRequestsSlice";
import rejectedReducer from "./rejectedRequestsSlice";
import requestCountReducer from "./requestCountSlice";
import userReducer from "./userSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    requestCount: requestCountReducer,
    interestedRequests: interestedRequestsReducer,
    connections: connectionsReducer,
    followers: followersReducer,
    following: followingReducer,
    rejected: rejectedReducer,
    ignoredRequests: ignoredRequestsReducer,
  },
});

export default appStore;
