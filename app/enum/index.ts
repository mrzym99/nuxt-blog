export enum ThemeEnum {
  System = 'system',
  Light = 'light',
  Dark = 'dark',
}

export enum LikeEnum {
  ARTICLE = 'article',
  COMMENT = 'comment',
  REPLY = 'reply',
}

export enum CommentEnum {
  ARTICLE = 'article',
  ALBUM = 'album',
}

export enum CommentOrderEnum {
  HOT = 'hot',
  LATEST = 'latest',
}

export enum ArticleTypeEnum {
  ORIGINAL = 'original', // 原创
  TRANSPORT = 'transport', // 转载
  TRANSLATE = 'translate', // 翻译
}

export enum ArticleContentEnum {
  MD = 'md', // markdown
  RICHTEXT = 'richtext', // rich text
}
