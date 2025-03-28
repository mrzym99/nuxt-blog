<template>
  <div class="mx-auto">
    <section class="h-20rem bg-gray-100 flex flex-col items-center justify-center other-bg">
      <h1 class="text-6xl leading-tight font-bold mb-6">Archive</h1>
    </section>
    <div class="smaller-container mx-auto pt-16">
      <div v-for="(yearPosts, year) in groupedPosts" :key="year" class="mb-12">
        <h2 class="text-2xl font-bold mb-6">{{ year }}</h2>
        <div class="space-y-6">
          <article v-for="post in yearPosts" :key="post.id" class="blog-card">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-xl font-semibold mb-2">
                  <NuxtLink :to="post.slug" class="hover:text-primary-color">
                    {{ post.title }}
                  </NuxtLink>
                </h3>
                <p class="text-gray-600">{{ post.excerpt }}</p>
              </div>
              <time class="text-sm text-gray-500">{{ post.date }}</time>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Mock data for blog posts
const posts = [
  {
    id: 1,
    title: "Getting Started with Nuxt.js",
    date: "March 28, 2024",
    excerpt: "Learn how to build modern web applications with Nuxt.js, a powerful Vue.js framework.",
    slug: "/posts/getting-started-with-nuxtjs",
  },
  {
    id: 2,
    title: "The Power of UnoCSS",
    date: "March 27, 2024",
    excerpt: "Discover how UnoCSS can help you create beautiful and responsive designs with minimal effort.",
    slug: "/posts/power-of-unocss",
  },
  {
    id: 3,
    title: "Building a Personal Blog",
    date: "March 26, 2024",
    excerpt: "A step-by-step guide to creating your own personal blog using modern web technologies.",
    slug: "/posts/building-personal-blog",
  },
  {
    id: 4,
    title: "CSS Best Practices",
    date: "March 25, 2024",
    excerpt: "Essential tips and tricks for writing clean, maintainable, and efficient CSS code.",
    slug: "/posts/css-best-practices",
  },
  {
    id: 5,
    title: "Vue.js vs React: A Comparison",
    date: "December 15, 2023",
    excerpt: "An in-depth comparison of Vue.js and React, exploring their strengths and use cases.",
    slug: "/posts/vue-vs-react",
  },
  {
    id: 6,
    title: "TypeScript Tips and Tricks",
    date: "December 10, 2023",
    excerpt: "Learn some advanced TypeScript features and best practices for better type safety.",
    slug: "/posts/typescript-tips",
  },
];

// Group posts by year
const groupedPosts = computed(() => {
  const groups: Record<string, typeof posts> = {};
  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear().toString();
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(post);
  });
  return groups;
});
</script>
