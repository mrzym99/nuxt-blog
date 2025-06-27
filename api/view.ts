import { $http } from '~/utils/request';

// 增加浏览记录
export const postViewDuration = (data?: any) =>
  $http({
    method: 'post',
    url: '/blog/view',
    data,
  });

// 获取浏览次数
export const getViewCount = (params?: any) =>
  $http({
    method: 'get',
    url: '/blog/view/viewDuration',
    params,
  });

// 获取浏览时长
export const getViewDuration = (params?: any) =>
  $http({
    method: 'get',
    url: '/blog/view/viewDuration',
    params,
  });
