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
  viewCount?: number;
  likeCount?: number;
  viewDuration?: number;
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
  ARTICLE = 'article',
  COMMENT = 'comment',
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
