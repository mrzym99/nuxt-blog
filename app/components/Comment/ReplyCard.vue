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
    <div class="reply-text">
      <CommentText :content="reply.content" :id="'r' + reply.id" />
    </div>
    <div class="reply-actions">
      <button class="action-btn" style="color: var(--primary-color);" @click="handleReply(comment, reply)">回复</button>
      <button v-if="user?.id === reply.reply?.id" class="action-btn cancel" @click="handleRevokeReply(comment, reply)">
        撤回
      </button>
      <button :class="{
        like: reply.isLike,
      }" class="action-btn" @click="handleLikeReply(reply)">
        <Icon name="ph:thumbs-up-duotone" class="size-1rem mr-1" />
        {{ reply.likeCount ? reply.likeCount : '' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Comment, IReply, UserDetail } from '~/types';
import { diffNowWord } from '~/utils/tool';

const props = defineProps<{
  comment: Comment;
  reply: IReply;
  user: UserDetail | null
}

>();

const emit = defineEmits<{
  (e: 'reply', comment: Comment, reply?: IReply): void;
  (e: 'like', reply: IReply): void;
  (e: 'revoke', comment: Comment, reply: IReply): void;
}

>();



function handleReply(comment: Comment, reply: IReply) {
  emit('reply', comment, reply);
}

function handleLikeReply(reply: IReply) {
  emit('like', reply);
}

function handleRevokeReply(comment: Comment, reply: IReply) {
  emit('revoke', comment, reply);
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


  .reply-to {
    font-size: 0.8rem;

    color: var(--text-light-color);

    .reply-to-user {
      color: var(--primary-color);
    }
  }

  .reply-text {
    color: var(--text-color);
  }

  .reply-actions {
    display: flex;
    margin-top: 0.5rem;
    gap: 0.8rem;

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
}

.cancel {
  color: var(--disabled-color);
}
</style>