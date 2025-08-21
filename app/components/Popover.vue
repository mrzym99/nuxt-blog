<template>
  <div class="popover-container">
    <div ref="triggerRef" class="popover-trigger">
      <slot name="trigger"></slot>
    </div>
    <div v-if="isVisible" class="popover-content" :class="[
      positionClass,
      {
        'is-visible': isVisible,
      },
    ]" :style="newPosition" ref="contentRef">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';

type Position =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'left-top'
  | 'left-bottom'
  | 'right'
  | 'right-top'
  | 'right-bottom';

type PopoverTrigger = 'click' | 'hover';

const props = defineProps({
  position: {
    type: String as () => Position,
    default: 'bottom',
  },
  offset: {
    type: Number,
    default: 8,
  },
  width: {
    type: [String, Number],
    default: null,
  },
  trigger: {
    type: String as () => PopoverTrigger,
    default: 'click',
  },
});

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>();

const contentRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const actualPosition = ref(props.position);

const newPosition = ref<any>(null);

const bindEvents = () => {
  if (props.trigger === 'click') {
    triggerRef.value?.addEventListener('click', togglePopover);
  } else {
    triggerRef.value?.addEventListener('mouseenter', showPopover);
  }
};

// 获取主位置（用于CSS类）
const positionClass = computed(() => {
  if (!actualPosition.value) return 'bottom';
  return actualPosition.value.split('-')[0];
});

// 计算 Popover 内容的位置并检查边界
const calcContentStyle = () => {
  if (!triggerRef.value) return {};

  const containerRect = triggerRef.value.getBoundingClientRect();
  const offset = props.offset;

  let top = 0;
  let left = 0;

  // 处理主要位置
  const [mainPosition, alignment] = actualPosition.value.split('-');

  switch (mainPosition) {
    case 'top':
      top = containerRect.top - offset;
      break;
    case 'bottom':
      top = containerRect.bottom + offset;
      break;
    case 'left':
      left = containerRect.left - offset;
      break;
    case 'right':
      left = containerRect.right + offset;
      break;
  }

  // 处理水平对齐方式
  if (mainPosition === 'top' || mainPosition === 'bottom') {
    if (!alignment || alignment === 'center') {
      // 居中对齐
      left = containerRect.left + containerRect.width / 2;
      // 因为使用fixed定位，需要在CSS中使用transform来居中
    } else if (alignment === 'left') {
      // 左对齐
      left = containerRect.left;
    } else if (alignment === 'right') {
      // 右对齐
      left = containerRect.right;
    }
  }

  // 处理垂直对齐方式
  if (mainPosition === 'left' || mainPosition === 'right') {
    if (!alignment || alignment === 'center') {
      // 居中对齐
      top = containerRect.top + containerRect.height / 2;
      // 因为使用fixed定位，需要在CSS中使用transform来居中
    } else if (alignment === 'top') {
      // 顶部对齐
      top = containerRect.top;
    } else if (alignment === 'bottom') {
      // 底部对齐
      top = containerRect.bottom;
    }
  }

  // 处理CSS的transform偏移
  let transform = '';
  if (
    (mainPosition === 'top' || mainPosition === 'bottom') &&
    (!alignment || alignment === 'center')
  ) {
    transform = 'translateX(-50%)';
  } else if (
    (mainPosition === 'left' || mainPosition === 'right') &&
    (!alignment || alignment === 'center')
  ) {
    transform = 'translateY(-50%)';
  } else if (alignment === 'right') {
    transform = 'translateX(-100%)';
  } else if (alignment === 'bottom') {
    transform = 'translateY(-100%)';
  }

  newPosition.value = {
    top: `${Math.round(top)}px`,
    left: `${Math.round(left)}px`,
    transform: transform,
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  };
};

// 重新计算位置，确保在视口内
const updatePositionInViewport = () => {
  if (!isVisible.value || !contentRef.value) return;

  const contentRect = contentRef.value.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const padding = 10; // 边界安全距离

  // 如果超出右侧边界
  if (contentRect.right > viewportWidth - padding) {
    contentRef.value.style.left = `${viewportWidth - contentRect.width - padding}px`;
    contentRef.value.style.transform = contentRef.value.style.transform.replace(
      'translateX(-50%)',
      ''
    );
    contentRef.value.style.transform = contentRef.value.style.transform.replace(
      'translateX(-100%)',
      ''
    );
  }

  // 如果超出左侧边界
  if (contentRect.left < padding) {
    contentRef.value.style.left = `${padding}px`;
    contentRef.value.style.transform = contentRef.value.style.transform.replace(
      'translateX(-50%)',
      ''
    );
    contentRef.value.style.transform = contentRef.value.style.transform.replace(
      'translateX(-100%)',
      ''
    );
  }

  // 如果超出底部边界
  if (contentRect.bottom > viewportHeight - padding) {
    contentRef.value.style.top = `${viewportHeight - contentRect.height - padding}px`;
    contentRef.value.style.transform = contentRef.value.style.transform.replace(
      'translateY(-50%)',
      ''
    );
    contentRef.value.style.transform = contentRef.value.style.transform.replace(
      'translateY(-100%)',
      ''
    );
  }

  // 如果超出顶部边界
  if (contentRect.top < padding) {
    contentRef.value.style.top = `${padding}px`;
    contentRef.value.style.transform = contentRef.value.style.transform.replace(
      'translateY(-50%)',
      ''
    );
    contentRef.value.style.transform = contentRef.value.style.transform.replace(
      'translateY(-100%)',
      ''
    );
  }
};

const showPopover = () => {
  isVisible.value = true;
  emit('update:visible', isVisible.value);

  calcContentStyle();
  // 在下一个渲染周期确保popover在视口内
  window.setTimeout(() => {
    contentRef.value?.addEventListener('mouseleave', hidePopover);
    updatePositionInViewport();
  }, 0);
};

const hidePopover = () => {
  isVisible.value = false;
  emit('update:visible', isVisible.value);
};

// 切换 Popover 显示状态
const togglePopover = () => {
  isVisible.value = !isVisible.value;
  emit('update:visible', isVisible.value);

  if (isVisible.value) {
    calcContentStyle();
    // 在下一个渲染周期确保popover在视口内
    window.setTimeout(() => {
      updatePositionInViewport();
    }, 0);
  }
};

// 点击外部关闭 Popover
const handleClickOutside = (event: MouseEvent) => {
  if (triggerRef.value && !triggerRef.value.contains(event.target as Node) && isVisible.value) {
    close();
  }
};

const close = () => {
  isVisible.value = false;
  emit('update:visible', false);
};

// 监听位置变化或显示状态变化时检查边界
watch([isVisible, () => props.position], () => {
  if (isVisible.value) {
    // 初始化为传入的位置
    actualPosition.value = props.position;

    // 延迟一段时间以确保DOM已渲染，然后检查位置
    window.setTimeout(() => {
      updatePositionInViewport();
    }, 50);
  }
});

// 窗口大小调整时重新检查边界
const handleResize = () => {
  if (isVisible.value && contentRef.value) {
    updatePositionInViewport();
  }
};

// 监听点击事件
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
  bindEvents();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});

defineExpose({
  close,
  isVisible,
});
</script>

<style lang="scss" scoped>
.popover-container {
  position: relative;
  display: inline-block;
}

.popover-content {
  position: fixed;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  min-width: 100px;
  max-width: 600px;
  opacity: 0;
  transform: scale(0.95);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  background: var(--bg-color);

  &.is-visible {
    opacity: 1;
    transform: scale(1);
  }
}

// 不同方向的动画起点
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
