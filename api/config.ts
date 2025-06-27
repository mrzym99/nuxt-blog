import type { IUser } from '~/types';
import { $http } from '~/utils/request';

// 获取博主信息
export const getBloggerInfo = (username?: string) =>
  $http<IUser>({
    method: 'get',
    url: '/blog/config/bloggerInfo/' + username,
  });

// 获取用户信息
export const getBlogUserInfo = (id?: number) =>
  $http<IUser>({
    method: 'get',
    url: '/blog/config/userInfo/' + id,
  });
