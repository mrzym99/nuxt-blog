<template>
  <div v-if="ip" class="flex items-center gap-1 text-12px">
    <Icon name="ph:map-pin-area" size="0.8rem" />
    {{ ip }}
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  ip?: string;
}>(); 
</script>