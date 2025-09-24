<template>
  <div class="comment-card">
    <div class="comment-header">
      <span class="username">{{ comment.commenter?.profile.nickName }}</span>
      <span class="time">{{ diffNowWord(comment?.createdAt) }}</span>
    </div>
    <div class="comment-text">
      <Content :content="comment.content" :id="'c' + comment.id" />
    </div>
    <div class="comment-actions">
      <button class="action-btn" @click="handleReply(comment)" style="color: var(--primary-color)">回复</button>
      <button v-if="user?.id === comment.commenter?.id" class="action-btn cancel" @click="handleRevokeComment(comment)">
        撤回
      </button>
      <button :class="{
        like: comment.isLike,
      }" class="action-btn" @click="handleLikeComment(comment)">
        <Icon name="ph:thumbs-up-duotone" class="size-1rem mr-1" />
        {{ comment.likeCount ? comment.likeCount : '' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  type Comment,
  type UserDetail,
} from '@/types/index';
import { diffNowWord } from '~/utils/tool';
import Content from './Content.vue';

const props = defineProps<{
  comment: Comment;
  user: UserDetail | null
}>();

const emit = defineEmits<{
  (e: 'reply', comment: Comment): void;
  (e: 'like', comment: Comment): void;
  (e: 'revoke', comment: Comment): void;
}>();



function handleReply(comment: Comment) {
  emit('reply', comment);
}

function handleLikeComment(comment: Comment) {
  emit('like', comment);
}

function handleRevokeComment(comment: Comment) {
  emit('revoke', comment);
}
</script>

<style lang="scss" scoped>
.comment-card {
  width: 100%;

  .comment-header {
    display: flex;
    justify-content: space-between;
    margin: 0 0 0.5rem 0;
  }

  .username {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-color);
  }

  .time {
    font-size: 0.8rem;

    color: var(--text-light-color);
  }

  .comment-text {
    color: var(--text-color);

    :deep(img) {
      max-width: 80px;
    }
  }

  .comment-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .action-btn {
    display: flex;
    align-items: center;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 0.8rem;

    color: var(--text-light-color);

    &:hover {
      color: var(--primary-color);
    }
  }
}

.cancel {
  color: var(--disabled-color);
}
</style>