<template>
  <Popover v-if="user" ref="popoverRef" position="bottom-right" :width="200">
    <template #trigger>
      <img
        class="size-1.5rem rounded-full cursor-pointer duration-300 ease-in-out hover:scale-110"
        :src="user?.avatar"
        :alt="user?.nickName"
      />
    </template>
    <div class="user-panel">
      <div class="user-list">
        <button class="user-item" @click="toUserCenter">
          <span class="user-name">User Center</span>
        </button>
        <button class="user-item" @click="logout">
          <span class="user-name">logout</span>
        </button>
      </div>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import Popover from './Popover.vue';
import { useUserStore } from '~/store';
import { storeToRefs } from 'pinia';
import { getToken } from '~/utils/auth';

const { user } = storeToRefs(useUserStore());
const router = useRouter();

function toUserCenter() {
  router.push(`/user-center/${user.value?.id}`);
}

function logout() {
  useUserStore().logout();
}

onMounted(() => {
  if (!user.value && getToken()) {
    useUserStore().setUser();
  }
});
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;

.user-panel {
  padding: 0.25rem;

  .user-title {
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    @include themed() {
      color: themed('text');
    }
  }

  .user-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .user-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: all $duration ease;
    width: 100%;
    text-align: left;

    &:hover {
      @include themed() {
        background-color: themed('border');
      }
    }

    &.active {
      @include themed() {
        background-color: themed('border');
      }
    }

    .user-color {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      border: 2px solid transparent;
      transition: all $duration ease;
    }

    .user-name {
      text-transform: uppercase;
      font-size: 0.875rem;
      @include themed() {
        color: themed('text');
      }
    }

    &.active .user-color {
      border-color: var(--primary-color);
    }
  }
}
</style>
