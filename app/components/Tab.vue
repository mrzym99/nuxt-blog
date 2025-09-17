<template>
  <div class="tab" :class="{ 'tab-border': showBorder, 'tab-spread': !showBorder }">
    <span v-for="option in options" :key="option.value" @click="handleChange(option.value)" class="tab-item"
      :class="{ active: modelValue === option.value }">{{ option.label }}</span>
  </div>
</template>

<script lang="ts" setup>
type Tab = {
  label: string;
  value: string;
};

const modelValue = defineModel<string>();

const props = withDefaults(defineProps<{
  options: Array<Tab>;
  showBorder?: boolean;
}>(), {
  showBorder: true
});

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
.tab {
  display: flex;
  padding: 0.5rem 0;

  .active {
    color: var(--primary-color) !important;
  }

  .tab-item {
    border: none;
    background: none;
    cursor: pointer;

    color: var(--text-light-color);
    padding: 0 0.5rem;

    &:hover {
      color: var(--primary-color);
    }
  }
}

.tab-border {
  border-bottom: 1px solid var(--border-color);
}

.tab-spread {
  span:not(:last-child) {
    border-right: 1px solid var(--border-color);
  }
}
</style>
