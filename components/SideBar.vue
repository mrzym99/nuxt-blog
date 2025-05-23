<template>
  <aside class="sidebar md:w-50 lg:w-70">
    <Loading :loading="loading">
      <!-- Profile Card -->

      <div class="blog-card">
        <div class="profile">
          <div class="avatar">
            <NuxtLink :to="`/user-center/${bloggerInfo?.id}`">
              <img :src="bloggerInfo?.profile.avatar" alt="blogger" />
            </NuxtLink>
          </div>
          <p class="text-xl font-bold mb-2">{{ bloggerInfo?.profile.nickName }}</p>
          <p class="mb-4">
            {{ bloggerInfo?.profile.introduction }}
          </p>
          <p class="mb-4">{{ bloggerInfo?.profile.signature }}</p>
          <div class="social-links">
            <a href="https://github.com/mrzym99" target="_blank" rel="noopener noreferrer">
              <Icon name="simple-icons:github" size="1.5rem" />
            </a>
            <a href="https://gitee.com/mrzym" target="_blank" rel="noopener noreferrer">
              <Icon name="simple-icons:gitee" size="1.5rem" />
            </a>
          </div>
          <div class="social-links">
            <a
              class="flex items-center gap-2 qq-link"
              alt="博客技术交流群"
              title="博客技术交流群"
              target="_blank"
              rel="noopener noreferrer"
              href="https://qm.qq.com/cgi-bin/qm/qr?k=qbJ2jOOHKKSNnJl5QTsGlBQW3nUyDda7&jump_from=webapi&authKey=rYys4wJtvbT6/TKf1ZAYZvquvVa46hmH/HEVCXpbXdHoSLAGyzruqMTvKlWcdslI"
            >
              <Icon name="simple-icons:qq" size="1rem" />
              加入 QQ 群
            </a>
          </div>
        </div>
      </div>

      <!-- Tags Cloud -->
      <div class="blog-card">
        <TagCloud />
      </div>
    </Loading>
    <!-- Friends -->
    <div class="blog-card">
      <h3>
        Friends
        <Popover position="bottom-left" :offset="8" :width="300" trigger="hover">
          <template #trigger>
            <button class="tip">tips</button>
          </template>
          <div class="text-[1rem] font-normal p-3 leading-loose">
            <h3 class="!my-1">添加友链步骤</h3>
            1.到博客源码地址，fork 项目<br />
            2.找到 SideBar 组件<br />
            3.仿照小张的 link 编写代码<br />
            4.可在本地运行检查代码<br />
            5.最后，向我提交 Pr<br />
            <a
              class="text-gradient underline"
              href="https://gitee.com/mrzym/nuxt-blog-developd-by-cursor"
              target="_blank"
              >点我跳转博客源码地址</a
            >
          </div>
        </Popover>
      </h3>
      <div class="friends">
        <ul>
          <li>
            <NuxtLink to="http://mrzym.top/" target="_blank" rel="noopener noreferrer">
              小张
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import TagCloud from '~/components/TagCloud.vue';
import { getBloggerInfo, getParameter } from '~/api';
import type { IUser } from '~/types';

const bloggerInfo = ref<IUser | null>(null);
const loading = ref(true);

function initBlogInfo() {
  getParameter('blogger').then(res => {
    const username = res.data;
    getBloggerInfo(username).then(res => {
      bloggerInfo.value = res.data;
      loading.value = false;
    });
  });
}

onMounted(() => {
  initBlogInfo();
});
</script>

<style lang="scss" scoped>
.qq-link {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: var(--primary-color);
    color: #fff !important;
  }
}

.tip {
  color: #ff8023;
  margin-left: 1rem;
}
</style>
