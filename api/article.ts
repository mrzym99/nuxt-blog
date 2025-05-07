import { get } from '~/utils/request';

// 获取文章列表
export const getArticleList = (params?: any) => get('/blog/article/list/front', params);

// 获取文章详情
export const getArticleDetail = (id: string) => get(`/blog/article/info/front/${id}`);
