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
import { computed } from "vue";

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    position?: "left" | "right";
    width?: string | number;
    title?: string;
    closeOnMaskClick?: boolean;
  }>(),
  {
    position: "right",
    width: "60%",
    closeOnMaskClick: true,
  }
);

// 计算过渡动画名称
const transitionName = computed(() => {
  return props.position === "right" ? "slide-right" : "slide-left";
});

// 计算抽屉样式
const drawerStyle = computed(() => {
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

.drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}

.drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 2001;
  transition: transform 0.3s ease-in-out;
  @include themed() {
    background-color: themed("bg");
    border: 1px solid themed("border");
  }

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
    @include themed() {
      border-color: themed("border");
    }

    .drawer-title {
      font-size: 1rem;
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
          color: #fff;
        }
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

// 遮罩层动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 左侧抽屉动画
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-left-enter-to,
.slide-left-leave-from,
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
}
</style>
