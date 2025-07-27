async function getAllPosts() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE}/blog/article/list/front?currentPage=1&pageSize=9999`,
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

    return posts.map((post: any) => ({
      loc: `/posts/${post.id}`,
      lastmod: new Date(post.updatedAt || post.createTime || Date.now()),
      changefreq: 'weekly',
      priority: 0.9,
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

async function getAllTags() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE}/blog/tag/all`, {
      headers: {
        'User-Agent': 'Sitemap Generator',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch tags:', response.status);
      return [];
    }

    const res = await response.json();
    const tags = Array.isArray(res.data) ? res.data : [];

    return tags.map((tag: any) => ({
      loc: `/archive/${tag.name}`,
      lastmod: new Date(tag.updatedAt || Date.now()),
      changefreq: 'monthly',
      priority: 0.5,
    }));
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

export default async function generateDynamicSitemap() {
  try {
    const posts = await getAllPosts();
    const tags = await getAllTags();

    // 添加静态页面
    const staticPages = [
      {
        loc: '/',
        lastmod: new Date(),
        changefreq: 'daily',
        priority: 1.0,
      },
      {
        loc: '/about',
        lastmod: new Date(),
        changefreq: 'monthly',
        priority: 0.7,
      },
      {
        loc: '/archive',
        lastmod: new Date(),
        changefreq: 'weekly',
        priority: 0.8,
      },
    ];

    return [...staticPages, ...posts, ...tags];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [];
  }
}
