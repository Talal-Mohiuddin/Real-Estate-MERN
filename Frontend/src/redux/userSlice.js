import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoginRequest: (state) => {
      state.loading = true;
    },
    userLoginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    userLoginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserRequest: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    updateUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserRequest: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
    },
    deleteUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    SignOutRequest: (state) => {
      state.loading = true;
    },
    SignOutSuccess: (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
    },
    SignOutFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  userLoginRequest,
  userLoginSuccess,
  userLoginFail,
  updateUserFail,
  updateUserRequest,
  updateUserSuccess,
  deleteUserFail,
  deleteUserRequest,
  deleteUserSuccess,
  SignOutRequest,
  SignOutSuccess,
  SignOutFail,
} = userSlice.actions;

export default userSlice.reducer;
