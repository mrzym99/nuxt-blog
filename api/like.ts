import { get, post } from '~/utils/request';

// 点赞
export const postLike = (data?: any) => post('/blog/like/up', data);

// 取消点赞
export const postCancelLike = (data?: any) => post('/blog/like/cancel', data);

// 获取点赞次数
export const getLikeCount = (params?: any) => get('/blog/like/likeCount', params);

// 判断是否点赞
export const getIsLike = (params?: any) => get('/blog/like/whetherLike', params);
