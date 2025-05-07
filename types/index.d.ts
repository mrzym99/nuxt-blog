// 全局声明IArticle接口
declare interface IArticle {
  id: number;
  title: string;
  description?: string;
  cover?: string;
  tags: Tag[];
  slug: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  content?: string;
  contentType: ContentType;
  order?: number | null;
  top?: number | null;
  type: ArticleType;
  originalUrl?: string;
  author: User | null;
}

declare interface User {
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

enum ArticleType {
  ORIGINAL = 0, // 原创
  TRANSPORT = 1, // 转载
  TRANSLATE = 2, // 翻译
}

enum ContentType {
  MD = 0, // markdown
  RICHTEXT = 1, // rich text
}

declare interface Tag {
  id: number;
  name: string;
}
