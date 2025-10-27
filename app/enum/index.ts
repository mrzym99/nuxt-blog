export enum ThemeEnum {
  SYSTEM = 'system',
  LIGHT = 'light',
  DARK = 'dark',
}

export enum LikeEnum {
  ARTICLE = 'article',
  COMMENT = 'comment',
  REPLY = 'reply',
}

export enum ContentTypeEnum {
  ARTICLE = 'article',
  COMMENT = 'comment',
  REPLY = 'reply',
  MESSAGE = 'message',
}

export enum ViewEnum {
  ARTICLE = 'article',
}

export enum CommentTypeEnum {
  ARTICLE = 'article',
  ALBUM = 'album',
  MESSAGE = 'message',
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

export enum MenuDirectionEnum {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export enum MenuTypeEnum {
  MENU = 'menu',
  LINK = 'link',
  BUTTON = 'button',
}

export enum ThirdLoginTypeEnum {
  GITHUB = 'github',
}

export enum LoginTypeEnum {
  PWD_LOGIN = 'pwd-login',
  CODE_LOGIN = 'code-login',
  GITHUB_LOGIN = 'github-login',
  REGISTER = 'register',
  RESET_PWD = 'reset-pwd',
}

export enum HttpMethodEnum {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export enum MessageTypeEnum {
  ALL = 'all',
  GENERAL = 'general', // 普通留言
  NEED_REPLY = 'needReply', // 需回复
  OPINION = 'opinion', // 意见反馈
}
