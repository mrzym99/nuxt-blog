import { defineEventHandler } from 'h3';
import { Feed } from 'feed';

// 从后端获取文章的辅助函数
async function fetchPosts() {
  try {
    // 这里替换成你的实际 API 地址
    const response = await fetch('http://mrzym.top:8888/article/blogHomeGetArticleList/1/999');

    if (response.status !== 200) {
      throw new Error('Failed to fetch posts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default defineEventHandler(async event => {
  const feed = new Feed({
    title: '我的博客',
    description: '分享技术、生活和有趣的故事',
    id: 'http://mrzym.top/',
    link: 'http://mrzym.top/',
    language: 'zh-CN',
    favicon: 'http://mrzym.top/favicon.ico',
    copyright: 'All rights reserved 2024',
    updated: new Date(),
    generator: 'Feed for Node.js',
    feedLinks: {
      rss2: 'http://mrzym.top/rss.xml',
    },
    author: {
      name: '张宇明',
      email: 'your-email@example.com',
      link: 'http://mrzym.top',
    },
  });

  // 从后端获取文章
  const posts = await fetchPosts();

  // 按日期排序
  const postList = posts.result.list;

  // 添加文章到 feed
  for (const post of postList) {
    feed.addItem({
      title: post.title,
      id: `http://mrzym.top/blog/${post.id}`,
      link: `http://mrzym.top/blog/${post.id}`,
      description: post.article_description,
      content: post.content,
      date: new Date(post.date),
      category: post.categoryName,
      author: [
        {
          name: 'zym',
          email: '2715158815@qq.com',
          link: 'http://mrzym.top',
        },
      ],
    });
  }

  // 设置响应头
  event.node.res.setHeader('content-type', 'application/xml');
  event.node.res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  // 返回 RSS feed
  return feed.rss2();
});
