import { ArticleTypeEnum, MessageTypeEnum } from '~/enum';

export const REG_USER_NAME = /^(?:[a-zA-Z0-9]{4,16}|(?:[\w+.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))$/;

export const REG_PWD = /^[\w@$!%*?&.]{6,18}$/;

/** Six digit code reg */
export const REG_CODE_SIX = /^\d{6}$/;

/** Four digit code reg */
export const REG_CODE_FOUR = /^[A-Za-z0-9]{4}$/;

export const PAGE_SIZE = 10;

export const ALL = 'all';

export const TOAST_DURATION = 2000;

export const TOAST_TOP = 36;

export const HEADER_HEIGHT = 54;

export const ARTICLE_HEADER_ID = 'blogArticleHeader';

export const ARTICLE_CONTENT_ID = 'blogArticleContent';

export const ARTICLE_TYPE_NAME = {
  [ArticleTypeEnum.ORIGINAL]: '原创',
  [ArticleTypeEnum.TRANSPORT]: '转载',
  [ArticleTypeEnum.TRANSLATE]: '翻译',
};

export const MESSAGE_TYPE_NAME = {
  [MessageTypeEnum.GENERAL]: '普通',
  [MessageTypeEnum.NEED_REPLY]: '需回复',
  [MessageTypeEnum.OPINION]: '意见反馈',
};
