import { $http } from '~/utils/request';

// 点赞
export const postLike = (data?: any) =>
  $http({
    method: 'post',
    url: '/blog/like/up',
    data,
  });

// 取消点赞
export const postCancelLike = (data?: any) =>
  $http({
    method: 'post',
    url: '/blog/like/cancel',
    data,
  });

// 获取点赞次数
export const getLikeCount = (params?: any) =>
  $http({
    method: 'get',
    url: '/blog/like/likeCount',
    params,
  });

// 判断是否点赞
export const getIsLike = (params?: any) =>
  $http({
    method: 'get',
    url: '/blog/like/whetherLike',
    params,
  });
