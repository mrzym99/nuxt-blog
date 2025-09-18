import type { CommentEnum } from '~/enum';

export type Recordable = Record<string, any>;

type baseModel = {
  id: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type Theme = 'light' | 'dark' | 'system';

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
}

export type IContent = {
  start: string;
  keyword: string;
  end: string;
};

export interface IArticleSearch extends baseModel {
  title: IContent;
  description?: IContent;
  cover?: string;
  tags: ITag[];
  slug: string;
  content?: IContent;
  contentType: ContentType;
  order?: number | null;
  top?: number | null;
  type: ArticleType;
  originalUrl?: string;
  author: IUser | null;
  viewCount?: number;
  likeCount?: number;
}

export interface IUser extends baseModel {
  username: string;
  status?: number;
  profile: Profile;
}

export type Profile = {
  id: number;
  avatar: string;
  address?: string;
  email: string;
  phone?: string;
  birthDate?: Date;
  introduction?: string;
  nickName: string;
  signature?: string;
  gender: number;
};

export type UserDetail = {
  id: number;
  nickName?: string;
  gender?: number;
  phone?: string;
  email?: string;
  avatar?: string;
  signature?: string;
  address?: string;
  birthDate?: Date;
  introduction?: string;
};

export type Captcha = {
  id: string;
  img: string;
};

export interface ITag extends baseModel {
  name: string;
  count: number;
  articles: IArticle[];
}

export type token = {
  access_token: string;
};

export type thirdToken = {
  token_type: string;
  access_token: string;
};

export type ArticleType = 'original' | 'transport' | 'translate';

export type CreateComment = {
  type: CommentEnum;
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
  type: CommentEnum;
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

export type ContentType = 'md' | 'richtext';

export type Comment = {
  id: number;
  type?: CommentEnum;
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

export interface IHttpOptions {
  method: any;
  url: string;
  params?: any;
  data?: any;
  options?: any;
}

export interface IApiResponse<T extends any> {
  data: T;
  code: number;
  message?: string;
}

export interface IPagination<T extends any> {
  currentPage: number;
  pageSize: number;
  total: number;
  list: Array<T>;
}
