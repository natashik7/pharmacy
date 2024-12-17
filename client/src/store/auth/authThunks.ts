import { createAsyncThunk } from "@reduxjs/toolkit";
import { ZodError } from "zod";
import { AxiosError } from "axios";
import authService from "../../services/authService";
import { LoginFormSchema, UserStatusEnum } from "../../types/authSchema";


export const loginThunk = createAsyncThunk(
  "auth/loginThunk",
  async (formData: { username: string; password: string }) => {
    try {
      const data = LoginFormSchema.parse(formData);
      console.log("Данные формы для логина:", data);
      const auth = await authService.login(data);
      return auth;
    } catch (error) {
      if (error instanceof ZodError) {
        console.log("Ошибка валидации при логине", error.issues);
      } else if (error instanceof AxiosError) {
        console.log("Ошибка запроса при логине", error.response?.data);
      }
      throw error;
    }
  }
);

// export const signupThunk = createAsyncThunk(
//   "auth/signupThunk",
//   async (formData: { name: string; email: string; password: string }) => {
//     try {
//       const data = SignupFormSchema.parse(formData);
//       console.log("Данные формы для регистрации:", data);
//       const auth = await authService.signup(data);
//       return auth;
//     } catch (error) {
//       if (error instanceof ZodError) {
//         console.log("Ошибка валидации при регистрации", error.issues);
//       } else if (error instanceof AxiosError) {
//         console.log("Ошибка запроса при регистрации", error.response?.data);
//       }
//       throw error;
//     }
//   }
// );

export const checkAuthThunk = createAsyncThunk(
  "auth/checkAuthThunk",
  async () => {
    try {
      const data = await authService.check();
      if (data.user.status === UserStatusEnum.logged) {
        return data;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        console.log("Ошибка валидации", error.issues);
      } else if (error instanceof AxiosError) {
        console.log("Ошибка запроса при валидации", error.message);
      }
      throw error;
    }
  }
);

export const logoutThunk = createAsyncThunk("auth/logoutThunk", async () => {
  try {
    await authService.logout();
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("Ошибка запроса при логауте", error.response?.data);
    }
    throw error;
  }
});
