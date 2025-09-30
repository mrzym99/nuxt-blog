<template>
  <div class="header-container">
    <div :class="menuClassList">
      <div class=" pc-menu">
        <div class="w-full flex justify-between items-center">
          <Logo />
          <div class="nav-links">
            <Search />
            <Menus :menuList="menuList" />
            <ThemeSwitch />
            <User />
          </div>
        </div>
      </div>
      <div class="mobile-menu">
        <div class="w-full flex justify-between items-center">
          <Logo />
          <div class="nav-links">
            <Search />
            <ThemeSwitch />
            <Icon name="carbon:menu" size="1.5rem" @click="toggleDrawer" />
          </div>
        </div>
      </div>
      <Drawer v-model="showDrawer" title="菜单" position="right">
        <UserMobile @click="toggleDrawer" />
        <Menus :menuList="allMenus" :direction="MenuDirectionEnum.HORIZONTAL" @click="toggleDrawer" />
      </Drawer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Logo from './Logo.vue';
import ThemeSwitch from '~/components/ThemeSwitch.vue';
import Search from '~/components/Search.vue';
import User from '~/components/User.vue';
import Menus from '~/components/Menus.vue';
import UserMobile from '~/components/UserMobile.vue';
import { menuList } from '~/router';
import { MenuDirectionEnum, MenuTypeEnum } from '~/enum';
import type { Menu } from '~/router';
import { useUserStore } from '~/store';
import { storeToRefs } from 'pinia';
import { useDebounceFn } from '@vueuse/core';


const { user } = storeToRefs(useUserStore());
const showDrawer = ref(false);

const toggleDrawer = () => {
  showDrawer.value = !showDrawer.value;
};

const allMenus = computed(() => {
  return menuList.concat(user.value?.id ? [...additionalMenuList] : [])
});

const additionalMenuList: Menu[] = [
  {
    name: '个人中心',
    icon: 'ph:user-circle',
    path: `/user-center/${user.value?.id}`,
    type: MenuTypeEnum.MENU,
  },
  {
    name: '用户设置',
    icon: 'ph:gear',
    path: '/setting',
    type: MenuTypeEnum.MENU,
  },
  {
    name: '退出',
    icon: 'ion:md-log-out',
    path: '',
    action: logout,
    type: MenuTypeEnum.BUTTON,
  },
];


function logout() {
  useUserStore().logout();
}


const lastScrollTop = ref(0);
const headerDown = ref(false)
const headerUp = ref(false)
const enableHeaderHide = import.meta.env.VITE_ENABLE_HEADER_HIDE === 'true';

const menuClassList = computed(() => {
  return [
    'header-section',
    headerDown.value ? 'header-down' : '',
    headerUp.value ? 'header-up' : '',
  ];
});

function scrollListener() {
  if (window.scrollY > 54) {
    headerUp.value = window.scrollY > lastScrollTop.value;
    headerDown.value = window.scrollY < lastScrollTop.value;
  } else {
    headerUp.value = false;
    headerDown.value = true;
  }
  lastScrollTop.value = window.scrollY;
}
const debounceRouterReplace = useDebounceFn(scrollListener, 20);

onMounted(() => {
  enableHeaderHide && window.addEventListener('scroll', debounceRouterReplace);
});

onBeforeUnmount(() => {
  enableHeaderHide && window.removeEventListener('scroll', debounceRouterReplace);
});
</script>

<style lang="scss" scoped>
.header-down {
  animation: down $duration ease-in-out forwards;
}

.header-up {
  animation: up $duration ease-in-out forwards;
}

@keyframes down {
  0% {
    top: -$header-height;
  }

  100% {
    top: 0;
  }
}

@keyframes up {
  0% {
    top: 0;
  }

  100% {
    top: -$header-height;
  }
}
</style>