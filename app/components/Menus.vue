<template>
  <div :class="['nav-links', menuClass]">
    <div v-for="item in menuList" :key="item.name">
      <NuxtLink v-if="!item.type || item.type === MenuTypeEnum.MENU" :class="{
        active: route.path === item.path,
      }" :to="item.path" :key="item.path" @click="menuClick(item)">
        <ClientIcon :icon="item.icon" size="1.2rem" />
        {{ item.name }}
      </NuxtLink>
      <a v-else-if="item.type === MenuTypeEnum.LINK" :href="item.path" target="_blank" rel="noopener noreferrer">
        <ClientIcon :icon="item.icon" size="1.2rem" />
        {{ item.name }}
      </a>
      <a href="" v-else-if="item.type === MenuTypeEnum.BUTTON" @click="item.action?.(item)">
        <ClientIcon :icon="item.icon" size="1.2rem" />
        {{ item.name }}
      </a>
    </div>
    <slot name="additional"></slot>
  </div>
</template>
<script lang="ts" setup>
import { MenuDirectionEnum, MenuTypeEnum } from '~/enum';
import { type Menu } from '~/router';

const props = withDefaults(defineProps<{
  menuList: Menu[];
  direction?: MenuDirectionEnum;
}>(), {
  direction: MenuDirectionEnum.VERTICAL,
})

const emit = defineEmits(['click']);

const menuClass = computed(() => {
  switch (props.direction) {
    case MenuDirectionEnum.HORIZONTAL:
      return 'flex-col items-start';
    case MenuDirectionEnum.VERTICAL:
      return 'flex-row';
  }
});

const route = useRoute();

function menuClick(item: Menu) {
  emit('click', item);
}
</script>
