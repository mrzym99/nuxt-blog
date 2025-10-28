import type { CommentTypeEnum, CommentOrderEnum, LikeEnum, ViewEnum } from '~/enum';

export type baseQuery = {
  currentPage: number;
  pageSize: number;
};

export interface IArticleQuery extends baseQuery {
  tagName?: string;
}

export interface ICommentQuery extends baseQuery {
  targetId: number;
  type: CommentTypeEnum;
  commentOrder: CommentOrderEnum;
}

export interface IReplyQuery extends baseQuery {
  parentId: number;
}

export interface IMessageQuery extends baseQuery {
  type?: string;
  content?: string;
}

export type LikeQuery = {
  targetId: number;
  type: LikeEnum;
};

export type ViewQuery = {
  type: ViewEnum;
  targetId: number;
  userId?: number;
};
