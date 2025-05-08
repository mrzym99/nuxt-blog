<template>
  <div>
    <KeepAlive :include="['Home']">
      <NuxtLayout>
        <NuxtPage :keepalive />
      </NuxtLayout>
    </KeepAlive>
  </div>
</template>

<script lang="ts" setup>
const keepalive = {
  include: ['Home', 'Archives'],
};
</script>
