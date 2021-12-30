import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

const initialState = {
  modal: false,
  postId: "",
  session: null,
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

    setSession: (state, action) => {
      state.session = action.payload;
    },
    setSessionNull: (state, action) => {
      state.session = null;
    },
  },
});

export const { setModal, setPostId, setSession, setSessionNull } =
  postSlice.actions;

export const selectPost = (state: RootState) => state.post;

export default postSlice.reducer;
