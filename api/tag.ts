import type { ITag } from '~/types';
import { $http, http } from '~/utils/request';

// 获取所有 tag
export const getAllTags = (params?: any) =>
  $http<ITag[]>({
    method: 'get',
    url: '/blog/tag/all',
    params,
  });

// 获取文章详情
export const getTagDetail = (id: string) =>
  http({
    method: 'get',
    url: `/blog/tag/info/${id}`,
  });
