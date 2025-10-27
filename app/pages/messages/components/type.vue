<template>
  <NuxtLink v-if="type" :to="`/messages/${type.value}`" :replace="true" :key="type.value"
    :class="['type', typeMap[type.value], showActive && type.value === route.params.type ? 'active' : '']">
    <Icon name="ph:bookmarks-light" size="1rem" />
    <strong>{{ type.label }}</strong>
  </NuxtLink>
</template>

<script lang="ts" setup>
import { MessageTypeEnum } from '~/enum';
import type { MessageType } from '~/types/message';

const { type, showActive } = defineProps<{
  type: MessageType;
  showActive?: boolean
}>()

const route = useRoute();
const typeMap: Record<MessageTypeEnum, string> = {
  [MessageTypeEnum.ALL]: 'all',
  [MessageTypeEnum.NEED_REPLY]: 'need-reply',
  [MessageTypeEnum.OPINION]: 'opinion',
  [MessageTypeEnum.GENERAL]: 'general',
}
</script>

<style lang="scss" scoped>
.type {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  padding: 3px 5px;
  color: var(--text-color);
  border-radius: 3px;

  @include hover-effect {
    transform: translateY(-1px);
  }

  &.active {
    color: var(--white-color);
    background-color: var(--tag-active-color) !important;
  }
}

.all {
  color: var(--white-color);
  background-color: var(--tag-all-color);
}

.general {
  color: var(--white-color);
  background-color: var(--tag-grey-color);
}

.announcement {
  color: var(--white-color);
  background-color: var(--primary-light-color);
}

.opinion {
  color: var(--white-color);
  background-color: var(--tag-normal-color);
}

.need-reply {
  color: var(--white-color);
  background-color: var(--warn-color);
}
</style>