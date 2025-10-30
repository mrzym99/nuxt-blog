<template>
  <div>
    <div class="blog-card">
      <span class="title">热门文章</span>
      <p class="recommend-item" v-for="item in data">
        <NuxtLink :to="'/posts/' + item.id">
          <span :title="item.title">{{ item.title }}</span>
        </NuxtLink>
      </p>
    </div>
    <div class="blog-card">
      <span class="title">最新留言</span>
      <NuxtLink class="home-message-item" v-for="item in messages" :to="'/messages/detail/' + item.id">
        <span class="mr-1">
          <span class="nickname">{{ item.nickName || item.user?.profile.nickName }}</span>
          :
        </span>
        <RichTextPreview class="content" :content="item.content" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getHotArticle, getMessages } from '~/api';
import RichTextPreview from '~/pages/posts/components/RichTextPreview.vue';

const { data } = await useAsyncData('hot-posts', async () => {
  const res = await getHotArticle();
  return res.data ?? []
});

const { data: messages } = await useAsyncData('latest-messages', async () => {
  const res = await getMessages({
    currentPage: 1,
    pageSize: 4,
  });
  return res.data.list ?? []
});
</script>
