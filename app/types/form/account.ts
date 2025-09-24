import type { ThirdLoginTypeEnum } from '~/enum';

export type PwdLoginForm = {
  username: string;
  password: string;
  code: string;
  captchaId: string;
};

export type CodeLoginForm = {
  email: string;
  code: string;
};

export type RegisterForm = {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
};

export type ThirdRegisterForm = {
  type: ThirdLoginTypeEnum;
  token_type: string;
  access_token: string;
  username: string;
  password: string;
  confirmPassword: string;
  from: ThirdLoginTypeEnum;
  uniqueId: string;
  avatar: string;
  address: string;
  nickName: string;
};

export type ResetPwdForm = {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
};

export type UserResetPwdForm = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ThirdTypeAndTokenForm = {
  type: ThirdLoginTypeEnum;
  code: string;
};
