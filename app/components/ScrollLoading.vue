<template>
  <div class="text-[var(--text-light-color)]">
    <Empty v-if="empty">
      <div>{{ emptyText }}</div>
    </Empty>
    <template v-else>
      <div v-show="loading" class="text-center loading">
        <Icon name="eos-icons:bubble-loading" size="1.6rem" />
      </div>
      <div v-if="fullLoaded" class="text-center text-sm">
        没有更多了
      </div>
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