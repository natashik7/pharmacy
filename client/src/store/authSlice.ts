import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosConfig';
import Cookies from 'js-cookie';
import type { AxiosResponse } from 'axios';
import type { RootState } from './index';
import type { AuthState, UserData, LoginResponse } from '../types/userTypes';

const initialState: AuthState = {
  user: null,
  role: 'guest',
  status: 'idle',
  error: null,
};

export const checkAuthStatus = createAsyncThunk<UserData, void, { rejectValue: string }>(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response: AxiosResponse<UserData> = await axiosInstance.get('/check-auth', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to check auth status');
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/login', credentials);
      const { token, username } = response.data;
      Cookies.set('token', token);
      return { username };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to login';
      return rejectWithValue(errorMessage);
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await axiosInstance.post('/logout');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload.username;
        state.role = 'user';
        state.status = 'succeeded';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.username;
        state.role = 'user';
        state.status = 'succeeded';
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.role = 'guest';
        state.status = 'idle';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.role = 'guest';
        state.status = 'idle';
      });
  },
});

export const selectAuth = (state: RootState): AuthState => state.auth;

export default authSlice.reducer;
