<script lang="ts" setup>
const router = useRouter();

const back = () => {
  router.back();
};
</script>

<template>
  <span class="back" title="Back">
    <Icon name="ph:arrow-left" size="1.2rem" @click="back" />
  </span>
</template>

<style lang="scss" scoped>
.back {
  cursor: pointer;
  display: flex;
  width: 1.725rem;
  height: 1.725rem;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--text-color);
  color: var(--text-color);
  border-radius: 9999px;
  transition: all 0.2s;

  &:hover {
    background-color: var(--primary-color);
    color: var(--white-color);
    border-color: transparent;
  }
}
</style>