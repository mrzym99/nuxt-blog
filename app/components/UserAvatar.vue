<template>
  <ClientOnly>
    <div class="flex items-center">
      <NuxtLink :to="`/user-center/${id}`">
        <div v-if="avatar" class="avatar mr-1" :style="{
          width: size,
          height: size
        }">
          <img :src="avatar" />
        </div>
      </NuxtLink>
      {{ nickName }}
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  size?: string | number;
  id: number;
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
</style>