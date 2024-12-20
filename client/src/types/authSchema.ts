import { z } from 'zod';

export enum UserStatusEnum {
  pending = 'pending',
  guest = 'guest',
  logged = 'logged',
}

export const userDataSchema = z.object({
  username: z.string(),
  id: z.number(),
});

export type UserDataType = z.infer<typeof userDataSchema>;

export const backendAuthSchema = z.object({
  accessToken: z.string(),
  user: userDataSchema,
});

export type UserType =
  | { status: UserStatusEnum.pending }
  | { status: UserStatusEnum.guest }
  | ({
      status: UserStatusEnum.logged;
    } & UserDataType);

export type AuthType = {
  accessToken: string;
  user: UserType;
};

export const LoginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

// export const SignupFormSchema = z.object({
//   username: z.string(),
//   password: z.string(),
// });

export type LoginForm = z.infer<typeof LoginFormSchema>;
// export type SignupForm = z.infer<typeof SignupFormSchema>;
