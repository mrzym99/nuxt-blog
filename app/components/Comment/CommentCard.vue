<template>
  <div class="comment-card">
    <div class="comment-header">
      <span class="username">{{ comment.commenter?.profile.nickName }}</span>
      <span class="time">{{ diffNowWord(comment?.createdAt) }}</span>
    </div>
    <Content v-if="!isEdit" :content="comment.content" :id="'c' + comment.id" />
    <CommentInput v-else v-model="content" :auto-focus="true">
      <template #footer>
        <div class="form-actions w-full">
          <button class="action-button cancel" @click="handleCancelEdit">取消</button>
          <button class="submit-button" :disabled="!comment.content.trim()" @click="handleSubmitEdit">
            保存
          </button>
        </div>
      </template>
    </CommentInput>
    <div class="comment-actions" v-if="!isEdit">
      <button class="action-button" @click="handleReply(comment)">回复</button>
      <button v-if="user?.id === comment.commenter?.id" class="action-button" @click="handleEditComment(comment)">
        编辑
        <span v-if="comment.updatedAt !== comment.createdAt" class="text-[12px] cancel">（{{
          diffNowWord(comment.updatedAt)
          }}）</span>
      </button>
      <button v-if="user?.id === comment.commenter?.id" class="action-button cancel"
        @click="handleRevokeComment(comment)">
        撤回
      </button>
      <button :class="{
        like: comment.isLike,
      }" class="action-button cancel" @click="handleLikeComment(comment)">
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
import CommentInput from './Input.vue'

const props = defineProps<{
  comment: Comment;
  user: UserDetail | null
}>();

const emit = defineEmits<{
  (e: 'reply', comment: Comment): void;
  (e: 'like', comment: Comment): void;
  (e: 'revoke', comment: Comment): void;
  (e: 'edit', content: string): void;
}>();

const isEdit = ref(false);
const content = ref('');

function handleReply(comment: Comment) {
  emit('reply', comment);
}

function handleLikeComment(comment: Comment) {
  emit('like', comment);
}

function handleRevokeComment(comment: Comment) {
  emit('revoke', comment);
}

function handleEditComment(comment: Comment) {
  content.value = comment.content;
  isEdit.value = true;
}

function handleCancelEdit() {
  isEdit.value = false;
}

function handleSubmitEdit() {
  emit('edit', content.value);
  content.value = '';
  isEdit.value = false;
}
</script>

<style lang="scss" scoped>
.comment-card {
  width: 100%;

  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
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

  .comment-actions {
    display: flex;
    gap: 0.5rem;
    margin: 0.5rem 0;
  }
}
</style>