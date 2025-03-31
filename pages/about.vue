<template>
  <div class="mx-auto">
    <section class="h-20rem bg-gray-100 flex flex-col items-center justify-center other-bg">
      <h1 class="text-6xl leading-tight font-bold mb-6">About Me</h1>
    </section>

    <div class="container pt-16 mx-auto prose prose-lg">
      <p class="mb-6 text-xl">
        Hello! I'm a passionate developer who loves creating beautiful and functional web
        applications. I believe in writing clean, maintainable code and sharing knowledge with the
        community.
      </p>

      <h2 class="text-2xl font-bold mt-8 mb-4">Skills</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div v-for="skill in skills" :key="skill" class="blog-card">
          {{ skill }}
        </div>
      </div>

      <h2 class="text-2xl font-bold mt-8 mb-4">Experience</h2>
      <div class="space-y-6">
        <div v-for="exp in experience" :key="exp.title" class="blog-card">
          <h3 class="text-xl font-semibold">{{ exp.title }}</h3>
          <p class="text-gray-600">{{ exp.company }} · {{ exp.period }}</p>
          <p class="mt-2">{{ exp.description }}</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold mt-8 mb-4">Connect</h2>
      <div class="flex gap-4">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="btn">
          GitHub
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="btn">
          Twitter
        </a>
        <a href="mailto:your.email@example.com" class="btn"> Email </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const skills = [
  'Vue.js',
  'Nuxt.js',
  'TypeScript',
  'UnoCSS',
  'SCSS',
  'Node.js',
  'Git',
  'Docker',
  'AWS',
];

const experience = [
  {
    title: 'Senior Frontend Developer',
    company: 'Tech Company',
    period: '2020 - Present',
    description: 'Leading frontend development team and implementing modern web solutions.',
  },
  {
    title: 'Full Stack Developer',
    company: 'Startup',
    period: '2018 - 2020',
    description: 'Developed and maintained multiple web applications using Vue.js and Node.js.',
  },
];
</script>
