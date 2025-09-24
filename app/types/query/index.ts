import type { CommentTypeEnum, CommentOrderEnum, LikeEnum, ViewEnum } from '~/enum';

export type baseQuery = {
  currentPage: number;
  pageSize: number;
};

export interface ICommentQuery extends baseQuery {
  targetId: number;
  type: CommentTypeEnum;
  commentOrder: CommentOrderEnum;
}

export interface IReplyQuery extends baseQuery {
  parentId: number;
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
