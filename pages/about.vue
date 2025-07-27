<template>
  <div class="mx-auto">
    <PageHeader class="z-1" title="About Me" />
    <div class="container mx-auto lt-sm:py-8 relative z-1">
      <div class="flex flex-col md:flex-row gap-8">
        <main class="flex-1 p-1rem">
          <div class="mb-6 text-xl">
            <h1 align="center">hey there 👋</h1>

            <h3 align="left">👩‍💻 About Me</h3>

            <p align="left">
              I'm a Web Developer from China.<br /><br />- 📚 I'm currently learning React、Vue.<br />-
              ⚡ In my free time I am blogging.
            </p>

            <h3 align="left">🛠 Language and tools</h3>

            <div
              style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 1rem"
              align="left"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                width="60"
                height="60"
                alt="typescript logo"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                width="60"
                height="60"
                alt="javascript logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                height="60"
                alt="nodejs logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg"
                height="60"
                alt="vuejs logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                height="60"
                alt="react logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg"
                height="60"
                alt="nestjs logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
                height="60"
                alt="html5 logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
                height="60"
                alt="css3 logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg"
                height="60"
                alt="sass logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                height="60"
                alt="nextjs logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg"
                height="60"
                alt="nuxtjs logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
                height="60"
                alt="docker logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg"
                height="60"
                alt="nginx logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg"
                height="60"
                alt="npm logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
                height="60"
                alt="git logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg"
                height="60"
                alt="redis logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
                height="60"
                alt="mysql logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sequelize/sequelize-original.svg"
                height="60"
                alt="sequelize logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg"
                height="60"
                alt="webpack logo"
              />
              <img
                width="60"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
                height="60"
                alt="vscode logo"
              />
            </div>

            <h3>contact me</h3>
            email: 2715158815@qq.com
          </div>
        </main>
        <SideBar />
      </div>
    </div>
    <ClientOnly>
      <Dots />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import SideBar from '~/components/SideBar.vue';
import PageHeader from '~/components/PageHeader.vue';
import Dots from '~/components/Dots.vue';
</script>
