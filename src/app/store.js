import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "../features/images/redux/imageSlice";
import postsReducer from "../features/posts/redux/postsSlice";
import usersReducer from "../features/users/redux/usersSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    images: imageReducer
  },
});
