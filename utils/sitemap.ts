async function getAllPosts() {
  const response = await fetch(
    'https://nest-server.mrzym.top:3366/blog/article/list/front?currentPage=1&pageSize=9999'
  );
  const res = await response.json();
  const posts = Array.isArray(res.data.list) ? res.data.list : [];

  return posts.map((post: any) => ({
    loc: `/posts/${post.id}`,
    lastmod: new Date(post.updatedAt),
    changefreq: 'daily',
    priority: 0.9,
  }));
}

async function getAllTags() {
  const response = await fetch('https://nest-server.mrzym.top:3366/blog/tag/all');
  const res = await response.json();
  const tags = Array.isArray(res.data) ? res.data : [];

  return tags.map((tag: any) => ({
    loc: `/archive/${tag.name}`,
    lastmod: new Date(tag.updatedAt),
    changefreq: 'daily',
    priority: 0.5,
  }));
}

export default async function generateDynamicSitemap() {
  const posts = await getAllPosts();
  const tags = await getAllTags();
  return [...posts, ...tags];
}
