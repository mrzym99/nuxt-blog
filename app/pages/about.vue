<template>
  <Card>
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
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                alt="typescript logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                alt="javascript logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                alt="nodejs logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" alt="vuejs logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="react logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg"
                alt="nestjs logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="html5 logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="css3 logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" alt="sass logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                alt="nextjs logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg"
                alt="nuxtjs logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
                alt="docker logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg" alt="nginx logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg"
                alt="npm logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="git logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="redis logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="mysql logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sequelize/sequelize-original.svg"
                alt="sequelize logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg"
                alt="webpack logo" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
                alt="vscode logo" />
            </div>

            <h3>📧 Leave a message</h3>

            <p class="py-1">I'm glad to hear from you! if you have any questions or suggestions, feel free to reach out.
            </p>
            <p class="py-1">我非常欢迎您的来信！如果您有任何问题或建议，请随时与我联系。</p>
            <p class="pt-4 text-1rem">
              如果您有时间也可以给我留下评论，我会尽快回复您~
              <br>
              <NuxtLink class="text-1rem" to="/messages/all" target="_blank">留言</NuxtLink>
            </p>
            <h3>📧 Contact me</h3>
            <p class="text-1rem"><a href="mailto:2715158815@qq.com">email: 2715158815@qq.com</a></p>
          </div>
        </main>
      </div>
    </div>
  </Card>
</template>

<style lang="scss" scoped>
img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  overflow: hidden;
}

a {
  color: var(--primary-color);
  text-decoration: underline;
}
</style>
