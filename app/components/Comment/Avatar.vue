<template>
  <div class="avatar" :style="{
    width: size,
    height: size
  }">
    <NuxtLink v-if="id" :to="`/user-center/${id}`">
      <img :src="avatar" :alt="nickName" />
    </NuxtLink>
    <NuxtLink v-else class="to-login" to="/login/pwd-login">登录</NuxtLink>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  size?: string | number;
  id?: number;
  avatar?: string;
  nickName?: string;
}>(), {
  size: '32px'
})

const size = computed(() => {
  return formate(props.size);
});

function formate(size: string | number) {
  return typeof size === 'string' ? size : size + 'px'
}
</script>

<style lang="scss" scoped>
.avatar {
  display: grid;
  place-items: center;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
  border-radius: 50%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.to-login {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  transition: all $duration ease;
  color: var(--nav-text-color) !important;
  background-color: var(--primary-color);

  &:hover {
    background-color: var(--secondary-color);
  }
}
</style>