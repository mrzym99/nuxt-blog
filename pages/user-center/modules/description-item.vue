<template>
  <div class="description-item">
    <div class="label" :style="labelStyle" v-if="label">{{ label }}</div>
    <div v-else class="no-label" :style="labelStyle"></div>
    <div class="value">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  labelWidth: {
    type: [Number, String],
    default: 80,
  },
});

const labelStyle = computed(() => {
  const width = typeof props.labelWidth === 'number' ? `${props.labelWidth}px` : props.labelWidth;
  return {
    width,
  };
});
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;

.description-item {
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  .no-label {
    width: 80px;
  }
  .label {
    position: relative;
    width: 80px;
    text-align: right;
    @include themed() {
      color: themed('text');
    }

    &::after {
      content: ':';
      position: absolute;
      right: -8px;
      top: 0;
    }
  }
  .value {
    margin-left: 1rem;
    flex: 1;
    @include themed() {
      color: themed('text-light');
    }
  }
}
</style>
