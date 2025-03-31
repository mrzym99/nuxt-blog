// 全局声明IArticle接口
declare interface IArticle {
  id: number;
  title: string;
  date?: string;
  readTime?: number;
  description?: string;
  slug: string;
  createTime: number;
  content: string;
  tags: string[];
  category?: string;
  cover?: string;
}
