<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="modal-mask" @click="handleMaskClick"></div>
    </Transition>
    <Transition name="zoom">
      <div v-if="modelValue" class="modal-wrapper" :class="{ 'is-mobile': isMobile }">
        <div class="modal" :style="modalStyle">
          <div class="modal-header">
            <slot name="header">
              <div class="modal-title">{{ title }}</div>
            </slot>
            <button class="close-primary-button" @click="handleClose">
              <Icon name="ph:x" size="1.6rem" />
            </button>
          </div>
          <div class="modal-content">
            <slot></slot>
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  width?: string | number;
  title?: string;
  closeOnMaskClick?: boolean;
  fullscreen?: boolean;
}>();

const emits = defineEmits<{
  (e: 'close'): void;
}>();

const modelValue = defineModel<boolean>()

// 移动端检测
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 监听窗口大小变化
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

// 计算弹窗样式
const modalStyle = computed(() => {
  if (isMobile.value || props.fullscreen) {
    return {
      width: '100%',
      height: '100%',
      maxWidth: 'none',
      margin: 0,
      borderRadius: 0,
    };
  }
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
  modelValue.value = false;
  emits('close');
};

watch(() => modelValue.value, () => {
  nextTick(() => {
    if (modelValue.value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
})
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: $z-index-mask;
}

.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-index-modal;

  &.is-mobile {
    align-items: flex-start;
  }
}

.modal {
  position: relative;
  min-width: 30%;
  min-height: 20vh;
  margin: 20px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem 0 1rem;

    .modal-title {
      font-size: 18px;
      color: var(--text-color);
      font-weight: 500;
    }

    .close-primary-button {
      cursor: pointer;
      transition: all $duration;
      color: var(--text-light-color);

      &:hover {
        color: var(--primary-color);
      }
    }
  }

  .modal-content {
    padding: 0.8rem 1rem;
    flex: 1;
    overflow-y: auto;
  }

  .modal-footer {
    padding: 1rem;
    border-top: 1px solid;
    border-color: var(--border-color);
  }
}
</style>
