<template>
  <ClientOnly>
    <div class="flex justify-center items-center">
      <Icon name="ph:thumbs-up-duotone" @click="handleLike(likePayload?.liked)" :class="{
        'cursor-pointer': true,
        like: likePayload?.liked,
      }" :size="size ?? '1.5rem'" />
      <span v-if="likePayload?.count" :class="{
        like: likePayload.liked,
      }" class="ml-1">{{ likePayload.count }}</span>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/store';
import { useLike } from '~/hooks/useLike';
import { LikeEnum } from '~/enum';

const props = defineProps<{
  id?: number;
  type: LikeEnum;
  size?: string;
}>();

const { $toast } = useNuxtApp()

const userStore = useUserStore();

const likeKey = computed(() => {
  return `${props.type}-${props.id}`;
});

const { map, load, toggle } = useLike();

const likePayload = computed(() => {
  return map.value[likeKey.value]
});

function handleLike(liked: boolean = false) {
  toggle(likeKey.value, userStore.user?.id);
  if (!liked) {
    $toast.success('点赞成功');
  }
}

watch([() => props.id, () => userStore.user?.id], () => {
  if (!props.id) return
  load(likeKey.value, userStore.user?.id);
})

onMounted(() => {
  if (!props.id) return
  load(likeKey.value, userStore.user?.id);
})
</script>