import type { viewForm } from '~/types/form/view';
import type { ViewQuery } from '~/types/query';
import { $http } from '~/utils/request';

// 增加浏览记录
export const postViewDuration = (data?: viewForm) =>
  $http({
    method: 'post',
    url: '/blog/view',
    data,
  });

// 获取浏览时长
export const getViewDuration = (params?: ViewQuery) =>
  $http({
    method: 'get',
    url: '/blog/view/viewDuration',
    params,
  });
