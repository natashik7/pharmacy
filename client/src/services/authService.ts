import type { AxiosInstance } from 'axios';
import axiosInstance from './axiosInstance';
import { backendAuthSchema, UserStatusEnum, AuthType } from '../types/authSchema';

class AuthService {
  constructor(private readonly client: AxiosInstance) {}

  async login(formData: { username: string; password: string }): Promise<AuthType> {
    const response = await this.client.post('/auth/login', formData);
    console.log('formData в сервисе логина', formData);
    const authData = backendAuthSchema.parse(response.data);
    console.log('Запрос данных:', authData);
    return {
      ...authData,
      user: { ...authData.user, status: UserStatusEnum.logged },
    };
  }

  // async signup(formData: { username: string; email: string; password: string }): Promise<AuthType> {
  //   const response = await this.client.post('/auth/signup', formData);
  //   console.log('formData в сервисе регистрации', formData);
  //   const authData = backendAuthSchema.parse(response.data);
  //   console.log('Запрос данных:', authData);
  //   return {
  //     ...authData,
  //     user: { ...authData.user, status: UserStatusEnum.logged },
  //   };
  // }

  async check(): Promise<AuthType> {
    const response = await this.client.get('/tokens/refresh');
    console.log('response >>>>>>>', response);
    const authData = backendAuthSchema.parse(response.data);
    return {
      ...authData,
      user: { ...authData.user, status: UserStatusEnum.logged },
    };
  }

  logout(): Promise<void> {
    return this.client.get('/auth/logout');
  }
}

const authService = new AuthService(axiosInstance);

export default authService;
