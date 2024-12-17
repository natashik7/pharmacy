import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserStatusEnum, type AuthType } from "../../types/authSchema";
import {
  checkAuthThunk,
  loginThunk,
  logoutThunk,
  // signupThunk,
} from "./authThunks";

const initialState: AuthType = {
  accessToken: "",
  user: { status: UserStatusEnum.pending },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      // .addCase(signupThunk.fulfilled, (state, action) => {
      //   state.accessToken = action.payload.accessToken;
      //   state.user = action.payload.user;
      // })
      .addCase(checkAuthThunk.fulfilled, (_, action) => action.payload)
      .addCase(checkAuthThunk.rejected, (state) => {
        state.user.status = UserStatusEnum.guest;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.accessToken = "";
        state.user = { status: UserStatusEnum.guest };
      });
  },
});

export const { setAccessToken } = authSlice.actions;

export default authSlice.reducer;
