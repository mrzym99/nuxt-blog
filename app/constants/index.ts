export const REG_USER_NAME = /^(?:[a-zA-Z0-9]{4,16}|(?:[\w+.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))$/;

export const REG_PWD = /^[\w@$!%*?&.]{6,18}$/;

/** Six digit code reg */
export const REG_CODE_SIX = /^\d{6}$/;

/** Four digit code reg */
export const REG_CODE_FOUR = /^[A-Za-z0-9]{4}$/;

export const TOAST_DURATION = 2000;

export const ARTICLE_HEADER_ID = 'blogArticleHeader';

export const ARTICLE_CONTENT_ID = 'blogArticleContent';

export const ArticleTypeName = {
  original: '原创',
  transport: '转载',
  translate: '翻译',
};
