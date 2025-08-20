<script lang="ts" setup>
const props = defineProps<{
  total: number;
  current: number;
  pageSize: number;
}>();

const canPrev = computed(() => props.current > 1);
const canNext = computed(() => props.current < props.total / props.pageSize);
const pages = computed(() => Math.ceil(props.total / props.pageSize));
const prev = computed(() => props.current - 1);
const next = computed(() => props.current + 1);

const showRightOmit = computed(() => pages.value - props.current > 2);
const showLeftOmit = computed(() => props.current - 2 > 1);

const visiblePages = computed(() => {
  const halfVisible = 2;
  let startPage = Math.max(props.current - halfVisible, 1);
  let endPage = Math.min(startPage + 2 * halfVisible, pages.value);
  if (endPage - startPage < 2 * halfVisible) {
    startPage = Math.max(endPage - 2 * halfVisible, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});
</script>

<template>
  <div class="pagination-bar">
    <NuxtLink
      class="pager"
      :class="{
        disabled: !canPrev,
      }"
      :to="`?current=${prev}`"
      >< prev
    </NuxtLink>
    <div class="pager-container">
      <span v-if="showLeftOmit" class="omit">...</span>
      <NuxtLink
        v-for="page in visiblePages"
        :key="page"
        :to="`?current=${page}`"
        class="page-item"
        :class="{
          active: page === current,
        }"
        >{{ page }}</NuxtLink
      >
      <span v-if="showRightOmit" class="omit">...</span>
    </div>
    <NuxtLink
      class="pager right"
      :class="{
        disabled: !canNext,
      }"
      :to="`?current=${next}`"
    >
      next ></NuxtLink
    >
  </div>
</template>
<style lang="scss" scoped>
.pagination-bar {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  .pager-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    .omit {
      margin-bottom: 8px;
      color: var(--disabled-color) !important;
    }

    .page-item {
      color: var(--text-color);
      cursor: pointer;
    }
  }
  .pager {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: var(--text-color);

    &:hover {
      color: var(--primary-color) !important;
    }
  }

  .right {
    justify-content: flex-end;
  }

  .active {
    pointer-events: none;
    color: var(--primary-color) !important;
    font-size: 1.4rem;
  }

  .disabled {
    pointer-events: none;
    color: var(--disabled-color) !important;
  }
}
</style>
