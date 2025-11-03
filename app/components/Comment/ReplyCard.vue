<template>
  <div class="reply-content">
    <div class="reply-header">
      <span>
        <span class="username">{{ reply.reply.profile.nickName }}</span>
        <span v-if="reply.replyTo" class="reply-to">
          回复
          <span class="reply-to-user">@{{ reply.replyTo.profile.nickName }}</span>
        </span>
      </span>
      <span class="time">{{ diffNowWord(reply?.createdAt) }}</span>
    </div>
    <RichTextRender v-if="!isEdit" :content="reply.content" :id="reply.id" :type="ContentTypeEnum.REPLY" />
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
    <div class="reply-actions">
      <button class="action-button" style="color: var(--primary-color);"
        @click="handleReply(comment, reply)">回复</button>
      <button v-if="user?.id === reply.reply?.id" class="action-button" @click="handleEditReply(reply)">
        编辑
        <span v-if="reply.updatedAt !== reply.createdAt" class="text-[12px] cancel">（{{
          diffNowWord(reply.updatedAt)
          }}）</span>
      </button>
      <button v-if="user?.id === reply.reply?.id" class="action-button cancel"
        @click="handleRevokeReply(comment, reply)">
        撤回
      </button>
      <button :class="{
        like: reply.isLike,
      }" class="action-button" @click="handleLikeReply(reply)">
        <Icon name="ph:thumbs-up-duotone" class="size-1rem mr-1" />
        {{ reply.likeCount ? reply.likeCount : '' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Comment, IReply, UserDetail } from '~/types';
import { diffNowWord } from '~/utils/tool';
import CommentInput from './Input.vue'
import RichTextRender from '../RichTextRender.vue';
import { ContentTypeEnum } from '~/enum';

const props = defineProps<{
  comment: Comment;
  reply: IReply;
  user: UserDetail | null
}>();

const emit = defineEmits<{
  (e: 'reply', comment: Comment, reply?: IReply): void;
  (e: 'like', reply: IReply): void;
  (e: 'revoke', comment: Comment, reply: IReply): void;
  (e: 'edit', content: string): void;
}>();

const isEdit = ref(false);
const content = ref('');

function handleReply(comment: Comment, reply: IReply) {
  emit('reply', comment, reply);
}

function handleLikeReply(reply: IReply) {
  emit('like', reply);
}

function handleRevokeReply(comment: Comment, reply: IReply) {
  emit('revoke', comment, reply);
}

function handleEditReply(reply: IReply) {
  content.value = reply.content;
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
.reply-content {
  flex: 1;

  .reply-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .time {
    font-size: 0.8rem;
    color: var(--text-light-color);
  }

  .username {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-color);
  }

  .reply-to {
    font-size: 0.8rem;

    color: var(--text-light-color);

    .reply-to-user {
      color: var(--primary-color);
    }
  }

  .reply-actions {
    display: flex;
    margin-top: 0.5rem;
    gap: 0.8rem;
  }
}
</style>