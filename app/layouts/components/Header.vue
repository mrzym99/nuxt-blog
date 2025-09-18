<template>
  <div class="header nav-links mb-1rem">
    <Search />
    <NuxtLink :class="{
      active: route.path === item.path,
    }" v-for="item in menuList" :to="item.path" :key="item.path">{{ item.name }}
    </NuxtLink>
    <ThemeSwitch />
    <User />
  </div>
</template>

<script lang="ts" setup>
import ThemeSwitch from '~/components/ThemeSwitch.vue';
import Search from '~/components/Search.vue';
import User from '~/components/User.vue';
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
    name: '归档',
    path: '/archive/all',
  },
  {
    name: '留言',
    path: '',
  },
  {
    name: '关于',
    path: '/about',
  },
];
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 54px;
  padding: 0 1rem;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 0;
}
</style>