<template>
  <div class="nav-links ">
    <NuxtLink :class="{
      active: route.path === item.path,
    }" v-for="item in menuList" :to="item.path" :key="item.path">{{ item.name }}
    </NuxtLink>
    <User />
  </div>

</template>

<script lang="ts" setup>
import User from '~/components/User.vue';
const route = useRoute();

type Menu = {
  name: string;
  path: string;
};

const menuList: Menu[] = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'About',
    path: '/about',
  },
  {
    name: 'Archive',
    path: '/archive/all',
  },
];
</script>
