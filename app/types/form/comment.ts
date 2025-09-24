import type { CommentTypeEnum } from '~/enum';
import type { IUser, Comment } from '~/types';

export type CommentForm = {
  type: CommentTypeEnum;
  targetId: Number;
  content: string;
  commenterId?: number; // 评论人
};

export type ReplyForm = {
  parentId: number;
  content: string;
  replyId?: number; // 回复人id
  replyToId?: number; // 被回复人 id
};

export type ReplyTo = {
  id?: number;
  parent: Comment;
  user: IUser;
};
