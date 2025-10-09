<template>
  <span class="inline-block" :style="{ width: size, height: size }">
    <Icon :name="icon" :size="size" />
  </span>
</template>

<script lang="ts" setup>
defineProps<{
  icon: string;
  size: string;
}>();
</script>