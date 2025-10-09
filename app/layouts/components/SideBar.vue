<template>
  <aside class="sidebar hide-scrollbar w-52 lt-md:w-full">
    <div class="lt-md:hidden" v-show="!showCateLog || !getHasCatalog">
      <!-- Profile Card -->
      <div class="blog-card !pt-0">
        <div class="profile">
          <div class="flex items-center gap-2 mb-4">
            <div class="avatar">
              <NuxtLink :to="`/user-center/${bloggerInfo?.id}`">
                <img :src="bloggerInfo?.profile.avatar" />
              </NuxtLink>
            </div>
            <span class="text-xl">{{ bloggerInfo?.profile.nickName }}</span>
          </div>
          <p class="mb-2 text-sm">
            {{ bloggerInfo?.profile.introduction }}
          </p>
          <p class="mb-2 text-md">{{ bloggerInfo?.profile.signature }}</p>
        </div>
      </div>
      <div class="blog-card">
        <div class="social-links">
          <a href="https://github.com/mrzym99" target="_blank" rel="noopener noreferrer">
            <Icon name="simple-icons:github" size="1.6rem" />
          </a>
          <a href="https://gitee.com/mrzym" target="_blank" rel="noopener noreferrer">
            <Icon name="simple-icons:gitee" size="1.6rem" />
          </a>
          <a class="flex items-center gap-2 qq-link text-sm" alt="博客技术交流群" title="博客技术交流群" target="_blank"
            rel="noopener noreferrer"
            href="https://qm.qq.com/cgi-bin/qm/qr?k=qbJ2jOOHKKSNnJl5QTsGlBQW3nUyDda7&jump_from=webapi&authKey=rYys4wJtvbT6/TKf1ZAYZvquvVa46hmH/HEVCXpbXdHoSLAGyzruqMTvKlWcdslI">
            <Icon name="simple-icons:qq" size="1rem" />
            加入 QQ 群
          </a>
        </div>
      </div>
      <!-- Friends -->
      <div class="blog-card">
        <h3 class="!mt-0 !mb-4">
          Friends
          <Popover position="bottom-left" :offset="8" :width="300" trigger="hover">
            <template #trigger>
              <span class="tip">tips</span>
            </template>
            <div class="text-[1rem] font-normal p-3 leading-loose">
              <h3 class="!my-1">添加友链步骤</h3>
              1.到博客源码地址，fork 项目<br />
              2.找到 SideBar 组件<br />
              3.仿照小张的 link 编写代码<br />
              4.可在本地运行检查代码<br />
              5.最后，向我提交 Pr<br />
              <a class="text-gradient" href="https://gitee.com/mrzym/nuxt-blog-developd-by-cursor"
                target="_blank">点我跳转博客源码地址</a>
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
      <div class="blog-card">
        <p>
          Copyright ©
          <a class="text-gradient" href="https://github.com/mrzym99" target="_blank">Zym</a>
          2025
        </p>
        <p>
          Powered by
          <a class="text-gradient" href="https://nuxt.com/" target="_blank">Nuxt</a>
        </p>
      </div>
    </div>
    <Catalog v-if="showCateLog" :articleId="getCurrentArticle!.id" />
  </aside>
</template>

<script setup lang="ts">
import { getBloggerInfo, getParameter } from '~/api';
import { useAsyncData } from '#app';
import Catalog from '~/layouts/components/Catalog.vue';
import { useArticleStore } from '~/store';
import { ArticleContentEnum } from '~/enum';

const { getCurrentArticle, getHasCatalog } = storeToRefs(useArticleStore());
const route = useRoute();

const showCateLog = computed(() => {
  return (
    route.path.includes('/posts') &&
    getCurrentArticle.value &&
    getCurrentArticle.value.contentType === ArticleContentEnum.MD
  );
});


const { data: username } = await useAsyncData('username', async () => {
  const res = await getParameter('blogger');
  return res.data;
});

const { data: bloggerInfo } = await useAsyncData('bloggerInfo', async () => {
  if (!username.value) return null;
  const res = await getBloggerInfo(username.value!);
  return res.data;
});
</script>

<style lang="scss" scoped>
.qq-link {
  padding: 0.2rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: all $duration ease-in-out;

  &:hover {
    background-color: var(--primary-color);
    color: #fff !important;
  }
}

.tip {
  color: #ff8023;
  margin-left: 1rem;
}

.social-links {
  display: flex;
  gap: 1rem;

  a {
    color: var(--text-light-color);

    @include hover-effect {
      color: var(--primary-color);
    }
  }
}
</style>
