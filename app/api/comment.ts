import type { Comment, IPagination, IReply } from '~/types';
import { $http } from '~/utils/request';

// 获取父评论列表 以及其子评论
export const getParentComments = (params?: any) =>
  $http<IPagination<Comment>>({
    method: 'get',
    url: '/blog/comment/list',
    params,
  });

// 获取回复列表
export const getReplyList = (params?: any) =>
  $http<IPagination<IReply>>({
    method: 'get',
    url: '/blog/comment/reply/list',
    params,
  });

// 创建评论
export const postComment = (data?: any) =>
  $http({
    method: 'post',
    url: '/blog/comment/create',
    data,
  });

// 创建回复
export const postReply = (data?: any) =>
  $http({
    method: 'post',
    url: '/blog/comment/reply',
    data,
  });

// 通过回复id获取评论id
export const getCommentIdByReplyId = (id?: number) =>
  $http({
    method: 'get',
    url: '/blog/comment/getCommentIdByReplyId/' + id,
  });

// 撤回评论
export const postDeleteComment = (id?: number) =>
  $http({
    method: 'delete',
    url: '/blog/comment/deleteComment/' + id,
  });

// 撤回回复
export const postDeleteReply = (id?: number) =>
  $http({
    method: 'delete',
    url: '/blog/comment/deleteReply/' + id,
  });
