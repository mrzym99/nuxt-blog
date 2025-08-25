<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage :keepalive="keepalive" />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
import { useHead } from '#app';

const keepalive = {
  include: ['Home', 'Archive'],
};

const route = useRoute();
const titleMap: Record<string, string> = {
  '/': '小张的博客 | Home',
  '/about': '小张的博客 | About Me',
  '/login/pwd-login': '小张的博客 | Login',
  '/login/reset-pwd': '小张的博客 | Reset Password',
  '/login/register': '小张的博客 | Register',
  '/login/code-login': '小张的博客 | Code Login',
  '/login/github-login': '小张的博客 | Github Login',
};
const routeTitle = computed(() => {
  if (route.path.includes('/archive')) {
    return '小张的博客 | Archive';
  } else if (route.path.includes('/posts')) {
    return undefined;
  } else if (route.path.includes('/user-center')) {
    return '小张的博客 | User Center';
  }

  return titleMap[route.path as string];
});

watch(
  () => route.path,
  () => {
    useHead({
      title: routeTitle.value,
    });
  }
);
</script>
