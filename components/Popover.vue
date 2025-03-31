<template>
  <div class="popover-container" ref="containerRef">
    <div class="popover-trigger" @click="togglePopover">
      <slot name="trigger"></slot>
    </div>
    <Transition name="fade">
      <div
        v-if="isVisible"
        class="popover-content"
        :class="[
          position,
          {
            'is-visible': isVisible,
          },
        ]"
        :style="contentStyle"
        ref="contentRef"
      >
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue';

  const props = defineProps<{
    position?: 'top' | 'bottom' | 'left' | 'right';
    offset?: number;
    width?: string | number;
  }>();

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
  }>();

  const containerRef = ref<HTMLElement | null>(null);
  const contentRef = ref<HTMLElement | null>(null);
  const isVisible = ref(false);

  // 计算 Popover 内容的位置
  const contentStyle = computed(() => {
    if (!containerRef.value || !contentRef.value) return {};

    const containerRect = containerRef.value.getBoundingClientRect();
    const contentRect = contentRef.value.getBoundingClientRect();
    const offset = props.offset || 8;

    let top = 0;
    let left = 0;

    switch (props.position) {
      case 'top':
        top = -contentRect.height - offset;
        left = (containerRect.width - contentRect.width) / 2;
        break;
      case 'bottom':
        top = containerRect.height + offset;
        left = (containerRect.width - contentRect.width) / 2;
        break;
      case 'left':
        top = (containerRect.height - contentRect.height) / 2;
        left = -contentRect.width - offset;
        break;
      case 'right':
        top = (containerRect.height - contentRect.height) / 2;
        left = containerRect.width + offset;
        break;
      default:
        top = containerRect.height + offset;
        left = (containerRect.width - contentRect.width) / 2;
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
      width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    };
  });

  // 切换 Popover 显示状态
  const togglePopover = () => {
    isVisible.value = !isVisible.value;
    emit('update:visible', isVisible.value);
  };

  // 点击外部关闭 Popover
  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.value &&
      !containerRef.value.contains(event.target as Node) &&
      isVisible.value
    ) {
      isVisible.value = false;
      emit('update:visible', false);
    }
  };

  // 监听点击事件
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<style lang="scss" scoped>
  @use '~/assets/styles/themes.scss' as *;

  .popover-container {
    position: relative;
    display: inline-block;
  }

  .popover-content {
    position: absolute;
    z-index: 1000;
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    padding: 0.5rem;
    min-width: 100px;
    max-width: 600px;
    transition: all 0.2s ease-in-out;
    transform-origin: top center;

    &.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // 动画效果
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease-in-out;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  // 不同方向的样式
  .top {
    transform-origin: bottom center;
  }

  .bottom {
    transform-origin: top center;
  }

  .left {
    transform-origin: right center;
  }

  .right {
    transform-origin: left center;
  }
</style>
