import type { Captcha, token, UserDetail } from '~/types';
import { get, post } from '~/utils/request';

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
  username: string;
  password: string;
  confirmPassword: string;
};

// 账户密码登录
export const postLogin = (data?: PwdLogin) => post<token>('/auth/login', data);

// 获取用户信息
export const getUserInfo = () => get<UserDetail>(`/auth/account/profile`);

// 获取验证码
export const getCaptcha = () => get<Captcha>('/auth/captcha/img');

// 发送邮箱验证码
export const getEmailCaptcha = (email: string) => post<Captcha>('/auth/email/send', { email });

// 验证码登录
export const postCodeLogin = (data?: CodeLogin) => post<token>('/auth/codeLogin', data);

// 用户注册
export const postRegister = (data?: Register) => post('/auth/register', data);

// 刷新 token
export const postRefreshToken = (data?: any) => post<token>('/auth/refreshToken', data);

// 退出登录
export const getLogout = () => get('auth/account/logout', {});

// 三方登录 获取跳转的 url
export const getThirdLogin = (type?: any) => post<token>('/auth/thirdLogin/' + type, {});

// 三方登录 根据 code 返回 token_type 和 token
export const getThirdTypeAntTOken = (params: any) => post<token>('/auth/thirdLogin/', params);

// 三方登录
export const postThirdLogin = (data?: any) => post<token>('/auth/thirdLogin/login', data);
