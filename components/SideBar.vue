<template>
  <aside class="sidebar md:w-50 lg:w-70">
    <!-- Profile Card -->
    <div class="blog-card">
      <div class="profile">
        <div class="avatar">
          <img :src="bloggerInfo?.profile.avatar || avatar" alt="Profile" />
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
            alt="博客技术交流群"
            title="博客技术交流群"
            target="_blank"
            rel="noopener noreferrer"
            href="https://qm.qq.com/cgi-bin/qm/qr?k=qbJ2jOOHKKSNnJl5QTsGlBQW3nUyDda7&jump_from=webapi&authKey=rYys4wJtvbT6/TKf1ZAYZvquvVa46hmH/HEVCXpbXdHoSLAGyzruqMTvKlWcdslI"
          >
            <img border="0" src="//pub.idqqimg.com/wpa/images/group.png" />
          </a>
        </div>
      </div>
    </div>

    <!-- Tags Cloud -->
    <div class="blog-card">
      <TagCloud />
    </div>

    <!-- Friends -->
    <div class="blog-card">
      <h3>Friends</h3>
      <div class="recent-posts">
        <ul>
          <li v-for="post in 1" :key="post">
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
import avatar from '~/assets/images/avatar.png';

const bloggerInfo = ref<IUser | null>(null);

function initBlogInfo() {
  getParameter('blogger').then(res => {
    const username = res.data;
    getBloggerInfo(username).then(res => {
      bloggerInfo.value = res.data;
    });
  });
}

onMounted(() => {
  initBlogInfo();
});
</script>
