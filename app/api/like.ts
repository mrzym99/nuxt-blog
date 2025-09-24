import type { LikeForm } from '~/types/form';
import type { LikeQuery } from '~/types/query';
import { $http } from '~/utils/request';

// 点赞
export const postLike = (data?: LikeForm) =>
  $http({
    method: 'post',
    url: '/blog/like/up',
    data,
  });

// 取消点赞
export const postCancelLike = (data?: LikeForm) =>
  $http({
    method: 'post',
    url: '/blog/like/cancel',
    data,
  });

// 获取点赞次数
export const getLikeCount = (params?: LikeQuery) =>
  $http({
    method: 'get',
    url: '/blog/like/likeCount',
    params,
  });

// 判断是否点赞
export const getIsLike = (params?: LikeForm) =>
  $http({
    method: 'get',
    url: '/blog/like/whetherLike',
    params,
  });
