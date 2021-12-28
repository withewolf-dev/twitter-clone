import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

const initialState = {};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
});

export const {} = postSlice.actions;

export const selectPost = (state: RootState) => state.post;

export default postSlice.reducer;
