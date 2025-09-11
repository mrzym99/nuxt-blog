import type { Captcha, IUser, Profile, thirdToken, token, UserDetail } from '~/types';
import { $http } from '~/utils/request';

export type PwdLogin = {
  username: string;
  password: string;
  code: string;
  captchaId: string;
};

export type CodeLogin = {
  email: string;
  code: string;
};

export type Register = {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
};

export type ThirdRegister = {
  type: string;
  token_type: string;
  access_token: string;
  username: string;
  password: string;
  confirmPassword: string;
  from: string;
  uniqueId: string;
  avatar: string;
  address: string;
  nickName: string;
};

export type ResetPwd = {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
};

export type UserResetPwd = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// 账户密码登录
export const postLogin = (data?: PwdLogin) =>
  $http({
    method: 'post',
    url: '/auth/login',
    data,
  });
// 获取用户信息
export const getUserInfo = () =>
  $http<IUser>({
    method: 'get',
    url: '/auth/account/profile',
  });

// 获取验证码
export const getCaptcha = () =>
  $http({
    method: 'get',
    url: '/auth/captcha/email',
  });

// 发送邮箱验证码
export const getEmailCaptcha = (email: string) =>
  $http({
    method: 'post',
    url: '/auth/email/send',
    data: { email },
  });

// 验证码登录
export const postCodeLogin = (data?: CodeLogin) =>
  $http({
    method: 'post',
    url: '/auth/codeLogin',
    data,
  });

// 用户重置密码
export const putUserResetPassword = (data?: UserResetPwd) =>
  $http({
    method: 'put',
    url: '/auth/account',
    data,
  });

// 修改个人信息
export const putUpdateProfile = (data?: Profile) =>
  $http({
    method: 'put',
    url: '/auth/account/profile',
    data,
  });

// 验证码重置密码
export const putResetPassword = (data?: ResetPwd) =>
  $http({
    method: 'put',
    url: '/auth/account/updatePasswordByCode',
    data,
  });

// 用户注册
export const postRegister = (data?: Register) =>
  $http({
    method: 'post',
    url: '/auth/register',
    data,
  });

// 刷新 token
export const postRefreshToken = (data?: any) =>
  $http({
    method: 'post',
    url: '/auth/refreshToken',
    data,
  });

// 退出登录
export const getLogout = () =>
  $http({
    method: 'get',
    url: '/auth/account/logout',
  });

// 三方登录 获取跳转的 url
export const getThirdLoginUrl = (type?: any) =>
  $http({
    method: 'get',
    url: '/auth/blog/third-login/url/' + type,
  });

// 三方登录 根据 code 返回 token_type 和 token
export const getThirdTypeAntToken = (params: any) =>
  $http({
    method: 'get',
    url: '/auth/blog/third-login/getTypeAndToken',
    params,
  });

// 判断用户是否已经注册
export const getIsRegister = (params: any) =>
  $http({
    method: 'get',
    url: '/auth/blog/third-login/checkRegister',
    params,
  });

// 三方登录
export const postThirdLogin = (data?: ThirdRegister) =>
  $http({
    method: 'post',
    url: '/auth/blog/third-login/login',
    data,
  });
