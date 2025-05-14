<template>
  <div>
    <NuxtLayout>
      <NuxtPage :keepalive />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
const keepalive = {
  include: ['Home', 'Archives'],
};
</script>
