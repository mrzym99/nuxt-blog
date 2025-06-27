import type { IArticle, IPagination } from '~/types';
import { $http } from '~/utils/request';

// 获取文章列表
export const getArticleList = (params?: any) =>
  $http<IPagination<IArticle>>({
    method: 'get',
    url: '/blog/article/list/front',
    params,
  });

// 获取文章详情
export const getArticleDetail = (id: string) =>
  $http<IArticle>({
    method: 'get',
    url: `/blog/article/info/front/${id}`,
  });

// 获取推荐文章
export const getRecommendArticle = (id?: number) =>
  $http<Array<IArticle>>({
    method: 'get',
    url: '/blog/article/recommend/front/' + id,
  });
