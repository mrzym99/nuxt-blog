<template>
  <div class="min-w-2rem flex align-center justify-center">
    <ClientOnly>
      <NuxtLink v-if="!user" class="to-login" to="/login/pwd-login">Login</NuxtLink>
      <Popover v-else ref="popoverRef" position="bottom-right" :width="160">
        <template #trigger>
          <img class="avatar size-2rem rounded-full cursor-pointer duration-300 ease-in-out hover:scale-110"
            :src="user?.avatar" :alt="user?.nickName" />
        </template>
        <div class="panel">
          <button v-for="item in menuList" :key="item.label" class="item" @click="item.click">
            <Icon :name="item.icon" size="1.5rem" />
            <span class="name">{{ item.label }}</span>
          </button>
        </div>
      </Popover>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import Popover from './Popover.vue';
import { useUserStore } from '~/store';
import { storeToRefs } from 'pinia';

const { user } = storeToRefs(useUserStore());
const router = useRouter();

const menuList = [
  {
    label: 'User Center',
    icon: 'ph:user-circle',
    click: toUserCenter,
  },
  {
    label: 'Settings',
    icon: 'ph:gear',
    click: ToSetting,
  },
  {
    label: 'Logout',
    icon: 'ion:md-log-out',
    click: logout,
  },
];

function toUserCenter() {
  router.push(`/user-center/${user.value?.id}`);
}

function ToSetting() {
  router.push('/setting');
}

function logout() {
  useUserStore().logout();
}
</script>

<style lang="scss" scoped>
.avatar {
  border: 1px solid var(--border-color);
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  .item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0.3rem;
    padding: 0.3rem;
    border: none;
    background: none;
    cursor: pointer;
    transition: all $duration ease;
    width: 100%;
    text-align: left;

    &:hover {
      color: var(--white-color);
      background-color: var(--primary-color);
    }

    .color {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      border: 2px solid transparent;
      transition: all $duration ease;
    }

    .active {
      color: var(--text-color);
      background: var(--tag-all-color) !important;
    }
  }
}
</style>
