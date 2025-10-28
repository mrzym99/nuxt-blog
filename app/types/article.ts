import type { ArticleContentEnum, ArticleTypeEnum } from '~/enum';
import type { baseModel } from './base';
import type { IUser } from './user';

export interface ITag extends baseModel {
  name: string;
  count: number;
  articles: IArticle[];
  articleCount: number;
}

export interface IArticle extends baseModel {
  title: string;
  description?: string;
  cover?: string;
  tags: ITag[];
  slug: string;
  content?: string;
  contentType: ArticleContentEnum;
  order?: number | null;
  top?: number | null;
  type: ArticleTypeEnum;
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
  contentType: ArticleContentEnum;
  order?: number | null;
  top?: number | null;
  type: ArticleTypeEnum;
  originalUrl?: string;
  author: IUser | null;
  viewCount?: number;
  likeCount?: number;
}
