import { defineEventHandler } from 'h3';
import { Feed } from 'feed';

// 从后端获取文章的辅助函数
async function fetchPosts() {
  try {
    // 这里替换成你的实际 API 地址
    const response = await fetch(
      'https://nest-server.mrzym.top:3366/blog/article/list/front?currentPage=1&pageSize=9999'
    );

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
    title: '小张的个人博客',
    description: '分享技术、生活和有趣的故事',
    id: 'https://blog.mrzym.top/',
    link: 'https://blog.mrzym.top/',
    language: 'zh-CN',
    favicon: 'https://blog.mrzym.top/favicon.ico',
    copyright: 'All rights reserved 2025',
    updated: new Date(),
    generator: 'Feed for Node.js',
    feedLinks: {
      rss2: 'https://blog.mrzym.top/rss.xml',
    },
    author: {
      name: '小张',
      email: '2715158815@qq.com',
      link: 'https://blog.mrzym.top/',
    },
  });

  // 从后端获取文章
  const posts = await fetchPosts();

  // 按日期排序
  const postList = posts.data.list;

  // 添加文章到 feed
  for (const post of postList) {
    feed.addItem({
      title: post.title,
      id: `https://blog.mrzym.top/post/${post.id}`,
      link: `https://blog.mrzym.top/post/${post.id}`,
      description: post.description,
      content: post.content,
      date: new Date(post.createdAt),
      category: post.tags,
      author: [
        {
          name: 'zym',
          email: '2715158815@qq.com',
          link: 'https://blog.mrzym.top/',
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
