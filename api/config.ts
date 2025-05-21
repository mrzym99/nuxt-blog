import type { IUser } from '~/types';
import { get } from '~/utils/request';

// 获取博主信息
export const getBloggerInfo = (username?: string) =>
  get<IUser>('/blog/config/bloggerInfo/' + username, {});

// 获取用户信息
export const getBlogUserInfo = (id?: number) => get<IUser>('/blog/config/userInfo/' + id, {});
