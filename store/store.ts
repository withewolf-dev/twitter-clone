import { configureStore } from "@reduxjs/toolkit";
import postSliceReducer from "../slice/post-slice";

export const store = configureStore({
  reducer: {
    post: postSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
