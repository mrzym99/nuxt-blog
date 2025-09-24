<template>
  <div>
    <ClientOnly>
      <div class="mb-4" @click="emit('click')">
        <NuxtLink v-if="!user" class="login" to="/login/pwd-login">登录</NuxtLink>
        <NuxtLink v-else :to="`/user-center/${user.id}`">
          <img class="avatar size-4rem rounded-full cursor-pointer duration-300 ease-in-out hover:scale-110"
            :src="user?.avatar" :alt="user?.nickName" />
        </NuxtLink>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store';
import { storeToRefs } from 'pinia';


const emit = defineEmits(['click']);

const { user } = storeToRefs(useUserStore());

</script>

<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 2rem;
  color: var(--white-color);
  background: var(--primary-color);
}

.avatar {
  border: 1px solid var(--border-color);
}
</style>
