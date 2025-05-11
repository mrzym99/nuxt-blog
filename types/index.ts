type baseModel = {
  id: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};
export interface IArticle extends baseModel {
  title: string;
  description?: string;
  cover?: string;
  tags: ITag[];
  slug: string;
  content?: string;
  contentType: ContentType;
  order?: number | null;
  top?: number | null;
  type: ArticleType;
  originalUrl?: string;
  author: IUser | null;
  viewCount?: number;
  likeCount?: number;
  viewDuration?: number;
}

export interface IUser extends baseModel {
  username: string;
  status?: number;
  profile: {
    id: number;
    avatar: string;
    address?: string;
    email: string;
    phone?: string;
    birthDate?: string;
    introduction?: string;
    nickName: string;
    signature?: string;
    gender: number;
  };
}

export interface ITag extends baseModel {
  name: string;
  count: number;
  articles: IArticle[];
}

export enum LikeType {
  ARTICLE = 'article',
  COMMENT = 'comment',
  REPLY = 'reply',
}

export enum CommentType {
  ARTICLE = 'article',
  ALBUM = 'album',
}

export enum ArticleType {
  ORIGINAL = 'original', // 原创
  TRANSPORT = 'transport', // 转载
  TRANSLATE = 'translate', // 翻译
}

export enum ContentType {
  MD = 'md', // markdown
  RICHTEXT = 'richtext', // rich text
}

export type CreateComment = {
  type: CommentType;
  targetId: Number;
  content: string;
  commenterId?: number; // 评论人
};

export type CreateReply = {
  parentId: number;
  content: string;
  replyId?: number; // 回复人id
  replyToId?: number; // 被回复人 id
};

// 类型定义
export interface IComment extends baseModel {
  type: CommentType;
  targetId: Number;
  content: string;
  likeCount: number;
  commenter: IUser;
  replies: IReply[];
}

export interface IReply extends baseModel {
  parentId: number;
  content: string;
  likeCount: number;
  reply: IUser;
  replyTo: IUser;
}

export type Comment = {
  id: number;
  type?: CommentType;
  targetId?: Number;
  content: string;
  parentId?: number;
  reply?: IUser;
  replyTo?: IUser;
  likeCount: number;
  commenter?: IUser;
  replyCount?: number;
  replies?: IReply[];
  createdAt?: Date;
  updatedAt?: Date;
};
