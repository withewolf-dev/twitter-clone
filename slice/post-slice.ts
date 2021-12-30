import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

const initialState = {
  modal: false,
  postId: "",
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setModal: (state, action) => {
      state.modal = action.payload;
    },
    setPostId: (state, action) => {
      state.postId = action.payload;
    },
  },
});

export const { setModal, setPostId } = postSlice.actions;

export const selectPost = (state: RootState) => state.post;

export default postSlice.reducer;
