<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="drawer-mask" @click="handleMaskClick"></div>
    </Transition>
    <Transition :name="transitionName">
      <div v-if="modelValue" class="drawer" :class="[position]" :style="drawerStyle">
        <div class="drawer-header">
          <slot name="header">
            <div class="drawer-title">{{ title }}</div>
          </slot>
          <button class="close-btn flex items-center justify-center" @click="handleClose">
            <Icon name="ph:x" size="1.5rem" />
          </button>
        </div>
        <div class="drawer-content">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    position?: 'left' | 'right';
    width?: string | number;
    title?: string;
    closeOnMaskClick?: boolean;
  }>(),
  {
    position: 'right',
    width: '60%',
    closeOnMaskClick: true,
  }
);

// 计算过渡动画名称
const transitionName = computed(() => {
  return props.position === 'right' ? 'slide-right' : 'slide-left';
});

// 计算抽屉样式
const drawerStyle = computed(() => {
  return {
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  };
});

// 处理遮罩层点击
const handleMaskClick = () => {
  if (props.closeOnMaskClick) {
    handleClose();
  }
};

// 处理关闭
const handleClose = () => {
  emit('update:modelValue', false);
};
</script>

<style lang="scss" scoped>
.drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: $z-index-mask;
}

.drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: $z-index-modal;
  transition: transform 0.3s ease-in-out;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);

  &.left {
    left: 0;
  }

  &.right {
    right: 0;
  }

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem 1rem;
    border-bottom: 1px solid;
    border-color: var(--border-color);

    .drawer-title {
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-color);
    }

    .close-btn {
      padding: 0.25rem;
      border: none;
      background: none;
      cursor: pointer;
      border-radius: 0.25rem;
      transition: all $duration;
      color: var(--text-light-color);

      &:hover {
        background-color: var(--hover-color);
        color: #fff;
      }

      i {
        font-size: 1.25rem;
      }
    }
  }

  .drawer-content {
    padding: 1rem;
    height: calc(100% - 4rem);
    overflow-y: auto;
  }
}


</style>
