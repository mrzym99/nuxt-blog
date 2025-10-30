import type { IArticle, IPagination } from '~/types';
import type { IArticleQuery } from '~/types/query';
import { $http } from '~/utils/request';

// 获取文章列表
export const getArticleList = (params?: IArticleQuery) =>
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

// 获取热门文章
export const getHotArticle = () =>
  $http<Array<IArticle>>({
    method: 'get',
    url: '/blog/article/hot/front',
  });
