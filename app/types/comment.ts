import type { CommentTypeEnum } from '~/enum';
import type { baseModel } from './base';
import type { IUser } from './user';

export interface IMentionUser {
  id: number;
  nickName?: string;
  username: string;
  avatar?: string;
  email?: string;
}

// 类型定义
export interface IComment extends baseModel {
  type: CommentTypeEnum;
  targetId: Number;
  content: string;
  likeCount: number;
  commenter: IUser;
  replies: IReply[];
  isLike: boolean;
}

export interface IReply extends baseModel {
  parentId: number;
  content: string;
  likeCount: number;
  reply: IUser;
  replyTo: IUser;
  isLike: boolean;
}

export type Comment = {
  id: number;
  type?: CommentTypeEnum;
  targetId?: Number;
  content: string;
  parentId?: number;
  reply?: IUser;
  replyTo?: IUser;
  likeCount: number;
  isLike?: boolean;
  commenter?: IUser;
  replyCount?: number;
  replies: IReply[];
  createdAt?: Date;
  updatedAt?: Date;
  fold: boolean;
  loading: boolean;
};
