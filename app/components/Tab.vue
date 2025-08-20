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
@use '~/assets/styles/global.scss' as *;

.tab {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;

  border-bottom: 1px solid var(--border-color);

  .active {
    color: var(--primary-color) !important;
  }

  .tab-item {
    border: none;
    background: none;
    cursor: pointer;

    color: var(--text-light-color);

    &:hover {
      color: var(--primary-color);
    }
  }
}
</style>
