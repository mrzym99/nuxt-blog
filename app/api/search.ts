import type { IArticle } from '~/types';
import { $http } from '~/utils/request';

// 获取文章列表
export const getSearchList = (text?: string) =>
  $http<Record<string, IArticle[]>>({
    method: 'get',
    url: '/blog/search/list/' + text,
  });
