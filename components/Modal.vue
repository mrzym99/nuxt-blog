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
            <button class="close-btn" @click="handleClose">
              <i class="i-carbon-close"></i>
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
import { computed, ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  modelValue: boolean;
  width?: string | number;
  title?: string;
  closeOnMaskClick?: boolean;
  fullscreen?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

// 移动端检测
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 监听窗口大小变化
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// 计算弹窗样式
const modalStyle = computed(() => {
  if (isMobile.value || props.fullscreen) {
    return {
      width: "100%",
      height: "100%",
      maxWidth: "none",
      margin: 0,
    };
  }
  return {
    width: typeof props.width === "number" ? `${props.width}px` : props.width,
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
  emit("update:modelValue", false);
};
</script>

<style lang="scss" scoped>
@use "~/assets/styles/themes.scss" as *;

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
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
  z-index: 1001;

  &.is-mobile {
    align-items: flex-start;
  }
}

.modal {
  position: relative;
  max-width: 90%;
  max-height: 90vh;
  margin: 20px;
  @include themed() {
    background-color: themed("bg");
    border: 1px solid themed("border");
  }
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid;
    @include themed() {
      border-color: themed("border");
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 500;
      @include themed() {
        color: themed("text");
      }
    }

    .close-btn {
      padding: 0.25rem;
      border: none;
      background: none;
      cursor: pointer;
      border-radius: 0.25rem;
      transition: all 0.2s;
      @include themed() {
        color: themed("text-light");

        &:hover {
          background-color: themed("hover");
          color: themed("primary");
        }
      }

      i {
        font-size: 1.25rem;
      }
    }
  }

  .modal-content {
    padding: 1rem;
    flex: 1;
    overflow-y: auto;
  }

  .modal-footer {
    padding: 1rem;
    border-top: 1px solid;
    @include themed() {
      border-color: themed("border");
    }
  }
}

// 遮罩层动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 弹窗动画
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.3s ease-in-out;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
