import type {
  CodeLoginForm,
  PwdLoginForm,
  RegisterForm,
  ResetPwdForm,
  ThirdRegisterForm,
  ThirdTypeAndTokenForm,
  UserResetPwdForm,
} from '~/types/form';
import type { IUser, Profile, Token } from '~/types';
import { $http } from '~/utils/request';
import type { ThirdLoginTypeEnum } from '~/enum';

// 账户密码登录
export const postLogin = (data?: PwdLoginForm) =>
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
export const postCodeLoginForm = (data?: CodeLoginForm) =>
  $http({
    method: 'post',
    url: '/auth/codeLogin',
    data,
  });

// 用户重置密码
export const putUserResetPassword = (data?: UserResetPwdForm) =>
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
export const putResetPassword = (data?: ResetPwdForm) =>
  $http({
    method: 'put',
    url: '/auth/account/updatePasswordByCode',
    data,
  });

// 用户注册
export const postRegister = (data?: RegisterForm) =>
  $http({
    method: 'post',
    url: '/auth/register',
    data,
  });

// 刷新 token
export const postRefreshToken = (data?: { accessToken: string }) =>
  $http<Token>({
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
export const getThirdLoginUrl = (type?: ThirdLoginTypeEnum) =>
  $http({
    method: 'get',
    url: '/auth/blog/third-login/url/' + type,
  });

// 三方登录 根据 code 返回 token_type 和 token
export const getThirdTypeAndToken = (params: ThirdTypeAndTokenForm) =>
  $http({
    method: 'get',
    url: '/auth/blog/third-login/getTypeAndToken',
    params,
  });

// 判断用户是否已经注册
export const getIsRegister = (params: ThirdRegisterForm) =>
  $http({
    method: 'get',
    url: '/auth/blog/third-login/checkRegister',
    params,
  });

// 三方登录
export const postThirdLogin = (data?: ThirdRegisterForm) =>
  $http({
    method: 'post',
    url: '/auth/blog/third-login/login',
    data,
  });
