export interface IArticle {
  id: number;
  title: string;
  description?: string;
  cover?: string;
  tags: ITag[];
  slug: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  content?: string;
  contentType: ContentType;
  order?: number | null;
  top?: number | null;
  type: ArticleType;
  originalUrl?: string;
  author: IUser | null;
}

export interface IUser {
  id: number;
  username: string;
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

export interface ITag {
  id: number;
  name: string;
  count: number;
  articles: IArticle[];
}

export enum LikeType {
  ARTICLE = 0,
  COMMENT = 1,
}

export enum ArticleType {
  ORIGINAL = 0, // 原创
  TRANSPORT = 1, // 转载
  TRANSLATE = 2, // 翻译
}

export enum ContentType {
  MD = 0, // markdown
  RICHTEXT = 1, // rich text
}
