// server/api/__sitemap__/urls.ts
import type { SitemapUrlInput } from '#sitemap/types';
import { defineSitemapEventHandler } from '#imports';
import type { IArticle, ITag } from '~/types';

async function getAllPosts() {
  try {
    const response = await fetch(
      `https://nest-server.mrzym.top:3366/blog/article/list/front?currentPage=1&pageSize=9999`,
      {
        headers: {
          'User-Agent': 'Sitemap Generator',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch posts:', response.status);
      return [];
    }

    const res = await response.json();
    const posts = Array.isArray(res.data?.list) ? res.data.list : [];

    return posts.map((post: IArticle) => ({
      loc: `/posts/${post.id}`,
      lastmod: new Date(post.updatedAt || post.createdAt || Date.now()),
      changefreq: 'weekly',
      priority: 0.9,
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default defineSitemapEventHandler(async () => {
  try {
    const posts = await getAllPosts();

    // 添加静态页面
    const staticPages = [
      {
        loc: '/',
        lastmod: new Date(),
        changefreq: 'daily',
        priority: 1.0,
      },
      {
        loc: '/message',
        lastmod: new Date(),
        changefreq: 'monthly',
        priority: 0.7,
      },
      {
        loc: '/about',
        lastmod: new Date(),
        changefreq: 'monthly',
        priority: 0.7,
      },
    ];

    return [...staticPages, ...posts] as SitemapUrlInput[];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [];
  }
});
