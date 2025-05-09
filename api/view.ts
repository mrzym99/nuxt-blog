import { get, post } from '~/utils/request';

// 增加浏览记录
export const postViewDuration = (data?: any) => post('/blog/view', data);

// 获取浏览次数
export const getViewCount = (params?: any) => get('/blog/view/viewCount', params);

// 获取浏览时长
export const getViewDuration = (params?: any) => get('/blog/view/viewDuration', params);
