<template>
  <div class="h-2.8rem flex justify-center items-center text-[var(--text-light-color)]">
    <Empty v-if="empty">
      <div>{{ emptyText }}</div>
    </Empty>
    <template v-else>
      <Icon v-show="loading" name="eos-icons:bubble-loading" size="1.6rem" />
      <span v-if="fullLoaded" class="text-sm">
        没有更多了
      </span>
    </template>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  loading?: boolean;
  fullLoaded?: boolean;
  empty?: boolean;
  emptyText?: string;
}>();
</script>