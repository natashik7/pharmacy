export type AuthState = {
  user: string | null;
  role: 'guest' | 'user';
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

export type UserData = {
	username: string;
	password: string;
}

export type LoginResponse = {
  token: string;
  username: string;
};