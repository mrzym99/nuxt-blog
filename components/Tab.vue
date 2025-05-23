<template>
  <div class="tab">
    <span
      v-for="option in options"
      :key="option.value"
      @click="handleChange(option.value)"
      class="tab-item"
      :class="{ active: modelValue === option.value }"
      >{{ option.label }}</span
    >
  </div>
</template>

<script lang="ts" setup>
type Tab = {
  label: string;
  value: string;
};

const modelValue = defineModel<string>();

defineProps<{
  options: Array<Tab>;
}>();

const emit = defineEmits<{
  (e: 'change', value: string): void;
  (e: 'update:modelValue', value: string): void;
}>();

const handleChange = (value: string) => {
  emit('change', value);
  emit('update:modelValue', value);
};
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;

.tab {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;

  @include themed() {
    border-bottom: 1px solid themed('border');
  }

  .active {
    @include themed() {
      color: themed('primary') !important;
    }
  }

  .tab-item {
    border: none;
    background: none;
    cursor: pointer;

    @include themed() {
      color: themed('text-light');

      &:hover {
        color: themed('primary');
      }
    }
  }
}
</style>
