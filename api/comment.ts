import { get, post } from '~/utils/request';

// 获取父评论列表 以及其子评论
export const getParentComments = (params?: any) => get('/blog/comment/list', params);

// 创建评论
export const postComment = (data?: any) => post('/blog/comment/create', data);

// 创建回复
export const postReply = (data?: any) => post('/blog/comment/reply', data);

// 获取回复列表
export const getReplyList = (params?: any) => get('/blog/comment/reply/list', params);

// 撤回评论
export const postDeleteComment = (data?: any) => post('/blog/comment/deleteComment', data);

// 撤回回复
export const postDeleteReply = (data?: any) => post('/blog/comment/deleteReply', data);
