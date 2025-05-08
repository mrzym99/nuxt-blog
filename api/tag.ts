import { get } from '~/utils/request';

// 获取文章列表
export const getAllTags = (params?: any) => get('/blog/tag/all', params);

// 获取文章详情
export const getTagDetail = (id: string) => get(`/blog/tag/info/${id}`);
