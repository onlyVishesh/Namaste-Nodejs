import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import connectionsReducer from "./connectionsSlice";
import feedReducer from "./feedSlice";
import followersReducer from "./followersSlice";
import followingReducer from "./followingSlice";
import ignoredRequestsReducer from "./ignoredRequestsSlice";
import interestedRequestsReducer from "./interestedRequestsSlice";
import rejectedReducer from "./rejectedRequestsSlice";
import requestCountReducer from "./requestCountSlice";
import searchReducer from "./searchSlice";
import skillsReducer from "./skillsSlice";
import userReducer from "./userSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    feed: feedReducer,
    requestCount: requestCountReducer,
    interested: interestedRequestsReducer,
    connections: connectionsReducer,
    followers: followersReducer,
    following: followingReducer,
    rejected: rejectedReducer,
    ignored: ignoredRequestsReducer,
    skills: skillsReducer,
    search: searchReducer,
  },
});

export default appStore;
