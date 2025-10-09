<template>
  <div class="user-info w-full block md:flex gap-[2rem]">
    <div class="flex flex-col items-start" style="flex-shrink: 0">
      <DescriptionItem label-width="0" class="flex justify-center">
        <img class="avatar w-8rem h-8rem  object-fit rounded-full" :src="userInfo?.profile.avatar" />
      </DescriptionItem>
      <DescriptionItem label-width="0">
        <p class="text-2xl font-bold">{{ userInfo?.profile.nickName }}</p>
      </DescriptionItem>
    </div>
    <div class="profile">
      <DescriptionItem label="用户名">
        {{ userInfo?.username }}
      </DescriptionItem>
      <DescriptionItem label="邮箱">
        {{ userInfo?.profile.email }}
      </DescriptionItem>
      <DescriptionItem label="性别">
        {{ userInfo?.profile.gender ? '男' : '女' }}
      </DescriptionItem>
      <DescriptionItem label="地址">
        {{ userInfo?.profile.address }}
      </DescriptionItem>
      <DescriptionItem label="生日">
        {{ formatDate(userInfo?.profile.birthDate) }}
      </DescriptionItem>
      <DescriptionItem label="个性签名">
        {{ userInfo?.profile.signature }}
      </DescriptionItem>
      <DescriptionItem label="个人介绍">
        {{ userInfo?.profile.introduction }}
      </DescriptionItem>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IUser } from '~/types';
import DescriptionItem from './description-item.vue';
import { formatDate } from '~/utils/tool';

defineProps<{
  userInfo?: IUser;
}>();
</script>

<style lang="scss" scoped>
.avatar {
  border: 1px solid var(--border-color);
}

.profile {
  flex: 1;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}
</style>
