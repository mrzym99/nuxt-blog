<template>
  <div class="mx-auto">
    <div class="lt-sm:py-4 relative z-1">
      <div class="flex flex-col md:flex-row gap-8">
        <main class="flex-1">
          <div class="mb-6 text-xl">
            <h1 align="center">hey there 👋</h1>

            <h3 align="left">👩‍💻 About Me</h3>

            <p align="left">
              I'm a Web Developer from China.<br /><br />- 📚 I'm currently learning React、Vue.<br />-
              ⚡ In my free time I am blogging.
            </p>

            <h3 align="left">🛠 Language and tools</h3>

            <div class="flex flex-wrap gap-2" align="left">
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                alt="typescript logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                alt="javascript logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                alt="nodejs logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg"
                alt="vuejs logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                alt="react logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg"
                alt="nestjs logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
                alt="html5 logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
                alt="css3 logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg"
                alt="sass logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                alt="nextjs logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg"
                alt="nuxtjs logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
                alt="docker logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg"
                alt="nginx logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg"
                alt="npm logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
                alt="git logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg"
                alt="redis logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
                alt="mysql logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sequelize/sequelize-original.svg"
                alt="sequelize logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg"
                alt="webpack logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
                alt="vscode logo"
              />
            </div>

            <h3>contact me</h3>
            email: 2715158815@qq.com
          </div>
        </main>
      </div>
    </div>
    <ClientOnly>
      <Dots />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import Dots from '~/components/Dots.vue';
</script>

<style lang="scss" scoped>
img {
  width: 80px;
  height: 80px;
}
</style>
