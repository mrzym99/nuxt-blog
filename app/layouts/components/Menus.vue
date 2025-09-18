<template>
  <div class="nav-links ">
    <Search />
    <NuxtLink :class="{
      active: route.path === item.path,
    }" v-for="item in menuList" :to="item.path" :key="item.path">{{ item.name }}
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();

type Menu = {
  name: string;
  path: string;
};

const menuList: Menu[] = [
  {
    name: '首页',
    path: '/',
  },
  {
    name: '关于',
    path: '/about',
  },
  {
    name: '归档',
    path: '/archive/all',
  },
  {
    name: '留言',
    path: '',
  },
];
</script>
