<template>
  <button class="theme-button">
    <ClientOnly>
      <Popover ref="popoverRef" position="bottom" :width="120">
        <template #trigger>
          <Icon class="title" :name="ThemeIcon" size="1.5rem"></Icon>
        </template>
        <div class="theme-panel">
          <div :class="{ 'theme-item': true, active: colorMode.preference === item.value }" v-for="item in themeList"
            :key="item.value" @click="toggleTheme(item.value)">
            <Icon :name="item.icon" size="1.5rem"></Icon>
            {{ item.name }}
          </div>
        </div>
      </Popover>
    </ClientOnly>
  </button>
</template>

<script setup lang="ts">
import { ThemeEnum } from '~/enum';
const colorMode = useColorMode();

const IconNames = {
  [ThemeEnum.LIGHT]: 'ph:sun',
  [ThemeEnum.DARK]: 'ph:moon-stars',
  [ThemeEnum.SYSTEM]: 'ph:command',
}

const themeList = [
  {
    name: 'System',
    icon: IconNames[ThemeEnum.SYSTEM],
    value: ThemeEnum.SYSTEM,
  },
  {
    name: 'Light',
    icon: IconNames[ThemeEnum.LIGHT],
    value: ThemeEnum.LIGHT,
  },
  {
    name: 'Dark',
    icon: IconNames[ThemeEnum.DARK],
    value: ThemeEnum.DARK,
  },
];

const ThemeIcon = computed(() => {
  return IconNames[colorMode.value as ThemeEnum]
})

const toggleTheme = (theme: ThemeEnum) => {
  setTheme(theme);
};

const setTheme = (theme: ThemeEnum) => {
  colorMode.preference = theme;
};
</script>

<style lang="scss" scoped>
.theme-button {
  width: 1.5rem;
  height: 1.5rem;
  padding: 0 !important;
  flex-shrink: 0;

  .title {
    &:hover {
      scale: 1.1;
      color: var(--primary-color);
    }
  }
}

.theme-panel {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  .theme-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0.3rem;
    padding: 0.3rem;
    transition: all 0.3s;

    &:hover {
      color: var(--white-color);
      background: var(--primary-color);
    }

  }

  .active {
    color: var(--white-color);
    background: var(--tag-all-color) !important;
  }
}
</style>
