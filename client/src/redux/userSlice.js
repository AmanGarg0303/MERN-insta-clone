import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
  updateLoading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    updateStart: (state) => {
      state.updateLoading = true;
      state.error = false;
    },
    updateSuccess: (state, action) => {
      state.updateLoading = false;
      state.error = false;
      state.currentUser.details = action.payload;
    },
    updateFailure: (state) => {
      state.updateLoading = false;
      state.error = true;
    },
    followUser: (state, action) => {
      if (!state.currentUser?.details?.following?.includes(action.payload)) {
        state.currentUser?.details?.following?.push(action.payload);
      }
    },
    unfollowUser: (state, action) => {
      if (state.currentUser?.details?.following?.includes(action.payload)) {
        // state.currentUser?.details?.following?.pull(action.payload);
        state.currentUser?.details?.following?.splice(
          state.currentUser?.details?.following.findIndex(
            (userId) => userId === action.payload
          ),
          1
        );
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateStart,
  updateSuccess,
  updateFailure,
  followUser,
  unfollowUser,
} = userSlice.actions;

export default userSlice.reducer;
