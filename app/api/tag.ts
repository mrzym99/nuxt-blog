import type { ITag } from '~/types';
import { $http, http } from '~/utils/request';

// 获取所有 tag
export const getAllTags = () =>
  $http<ITag[]>({
    method: 'get',
    url: '/blog/tag/all',
  });

// 获取标签详情
export const getTagDetail = (id: string) =>
  http({
    method: 'get',
    url: `/blog/tag/info/${id}`,
  });
