import type { IArticle, IPagination } from '~/types';
import { get } from '~/utils/request';

// 获取文章列表
export const getArticleList = (params?: any) =>
  get<IPagination<IArticle>>('/blog/article/list/front', params);

// 获取文章详情
export const getArticleDetail = (id: string) => get<IArticle>(`/blog/article/info/front/${id}`);

// 获取推荐文章
export const getRecommendArticle = (id?: number) =>
  get<Array<IArticle>>('/blog/article/recommend/front/' + id);
