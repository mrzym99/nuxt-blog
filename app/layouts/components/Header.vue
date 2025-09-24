<template>
  <div class="header-section">
    <div class="pc-menu">
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
</script>