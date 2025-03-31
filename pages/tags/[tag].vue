<template>
  <div class="container mx-auto py-8">
    <header class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">Posts tagged with "{{ tag }}"</h1>
      <p class="text-gray-600">
        {{ filteredPosts.length }} post{{ filteredPosts.length !== 1 ? 's' : '' }}
      </p>
    </header>

    <div class="space-y-8">
      <article
        v-for="post in filteredPosts"
        :key="post.id"
        class="blog-post group cursor-pointer"
        @click="navigateTo(post.slug)"
      >
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex-1">
            <h3 class="post-title group-hover:text-primary transition-colors">
              {{ post.title }}
            </h3>
            <div class="post-meta">
              <span>{{ post.date }}</span>
              <span class="mx-2">·</span>
              <span>{{ post.readTime }} min read</span>
            </div>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="tags">
              <span v-for="tag in post.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="flex items-center">
            <span class="text-gray-400 group-hover:text-primary transition-colors">
              Read More →
            </span>
          </div>
        </div>
      </article>

      <div v-if="filteredPosts.length === 0" class="text-center py-12">
        <p class="text-gray-600">No posts found with this tag.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const route = useRoute();
  const tag = route.params.tag as string;

  // Mock data for blog posts
  const posts = [
    {
      id: 1,
      title: 'Getting Started with Nuxt.js',
      date: 'March 28, 2024',
      readTime: 5,
      excerpt:
        'Learn how to build modern web applications with Nuxt.js, a powerful Vue.js framework.',
      slug: '/posts/getting-started-with-nuxtjs',
      tags: ['Nuxt.js', 'Vue.js', 'JavaScript'],
    },
    {
      id: 2,
      title: 'The Power of UnoCSS',
      date: 'March 27, 2024',
      readTime: 4,
      excerpt:
        'Discover how UnoCSS can help you create beautiful and responsive designs with minimal effort.',
      slug: '/posts/power-of-unocss',
      tags: ['CSS', 'UnoCSS', 'Frontend'],
    },
    {
      id: 3,
      title: 'Building a Personal Blog',
      date: 'March 26, 2024',
      readTime: 6,
      excerpt:
        'A step-by-step guide to creating your own personal blog using modern web technologies.',
      slug: '/posts/building-personal-blog',
      tags: ['Web Development', 'Tutorial'],
    },
    {
      id: 4,
      title: 'CSS Best Practices',
      date: 'March 25, 2024',
      readTime: 7,
      excerpt: 'Essential tips and tricks for writing clean, maintainable, and efficient CSS code.',
      slug: '/posts/css-best-practices',
      tags: ['CSS', 'Frontend', 'Best Practices'],
    },
  ];

  // Filter posts by tag
  const filteredPosts = computed(() => {
    return posts.filter(post => post.tags.includes(tag));
  });
</script>
