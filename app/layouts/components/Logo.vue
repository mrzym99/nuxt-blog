<template>
  <div class="logo">
    <NuxtLink to="/">
    <img :src="Logo" alt="logo">
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import Logo from '~/assets/images/logo.png'
</script>