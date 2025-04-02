import { get } from '~/utils/request';

// 获取文章列表
export const getArticleList = (params?: any) => get('/article/blogHomeGetArticleList/1/5', params);

// 获取文章详情
export const getArticleDetail = (id: string) => get(`/article/getArticleById/${id}`);
