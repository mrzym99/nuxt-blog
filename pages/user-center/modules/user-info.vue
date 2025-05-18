<template>
  <div class="user-info">
    <DescriptionItem>
      <img class="w-80px h-80px object-fit" :src="userInfo?.profile.avatar" alt="avatar"
    /></DescriptionItem>
    <DescriptionItem label="用户名">
      {{ userInfo?.username }}
    </DescriptionItem>
    <DescriptionItem label="昵称">
      {{ userInfo?.profile.nickName }}
    </DescriptionItem>
    <DescriptionItem label="性别">
      {{ userInfo?.profile.gender ? '男' : '女' }}
    </DescriptionItem>
    <DescriptionItem label="邮箱">
      {{ userInfo?.profile.email }}
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
</template>

<script lang="ts" setup>
import type { IUser } from '~/types';
import DescriptionItem from './description-item.vue';
import { formatDate } from '~/utils/tool';

defineProps<{
  userInfo: IUser;
}>();
</script>
