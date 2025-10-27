<template>
  <div ref="commentRef" class="comments-section" v-click-outside="clickOutside">
    <!-- 评论列表 -->
    <div class="comments-list">
      <!-- 主评论输入框 -->
      <div class="comment-form">
        <ClientOnly>
          <div class="form-content gap-1rem">
            <CommentAvatar :id="user?.id" :nick-name="user?.nickName" :avatar="user?.avatar" :size="42" />
            <CommentInput ref="inputRefOne" v-model="commentContent" :placeholder="user?.id ? '请输入' : '先登录才能愉快的评论哦'">
              <template #footer>
                <div class="form-actions">
                  <button class="submit-button" :disabled="!commentContent.trim()" @click="handleSubmit">
                    发表评论
                  </button>
                </div>
              </template>
            </CommentInput>
          </div>
        </ClientOnly>
      </div>
      <div v-if="comments.length === 0" class="no-comments">暂无评论，快来抢沙发吧！</div>
      <template v-else>
        <Tab v-model="commentOrder" :options="tabOptions" :show-border="false" @change="toggleTab" />
        <TransitionGroup name="fade-in">
          <div v-for="comment in comments" :key="comment.id" :id="'comment' + comment.id" class="comment-item" :class="{
            'focus-comment': hasScrollToView && showCommentFocus && routerCommentId && comment.id === routerCommentId,
          }">
            <div class="comment-avatar-box">
              <CommentAvatar :id="comment.commenter?.id" :nick-name="comment.commenter?.profile?.nickName"
                :avatar="comment.commenter?.profile.avatar" :size="36" />
            </div>
            <div class="comment-content">
              <CommentCard :comment="comment" :user="user" @reply="handleReply" @revoke="handleRevokeComment"
                @like="handleLikeComment" @edit="(val) => handleEditComment(comment, val)" />
              <!-- comment 回复框 -->
              <transition name="fade-in">
                <div v-if="replyTo && !replyTo.id && replyTo.parent.id === comment.id" class="comment-form">
                  <CommentInput ref="inputRefTwo" v-model="replyContent"
                    :placeholder="user?.id ? `回复 @${replyTo.user.profile.nickName}` : '先登录才能愉快的评论哦'">
                    <template #footer>
                      <div class="form-actions w-full">
                        <button class="action-button cancel" @click="cancelReply">取消</button>
                        <button class="submit-button" :disabled="!replyContent.trim()" @click="handleSubmit">
                          回复
                        </button>
                      </div>
                    </template>
                  </CommentInput>
                </div>
              </transition>
              <!-- 子评论列表 -->
              <div v-if="comment.replyCount" class="replies-list">
                <TransitionGroup name="fade-in">
                  <div v-for="reply in returnReplies(comment.replies, comment.fold)" :key="reply.id"
                    :id="'reply' + reply.id" class="reply-item" :class="{
                      'focus-comment': hasScrollToView && showCommentFocus && routerReplyId && reply.id === routerReplyId,
                    }">
                    <div class="reply-item-box">
                      <CommentAvatar :id="reply.reply?.id" :nick-name="reply.reply?.profile?.nickName"
                        :avatar="reply.reply?.profile.avatar" :size="32" />
                      <div class="reply-content">
                        <ReplyCard :comment="comment" :reply="reply" :user="user" @reply="handleReply"
                          @revoke="handleRevokeReply" @like="handleLikeReply"
                          @edit="(val) => handleEditReply(reply, val)" />
                        <!-- reply 回复框 -->
                        <transition name="fade-in">
                          <div v-if="replyTo && replyTo.id === reply.id" class="comment-form">
                            <CommentInput ref="inputRefThree" v-model="replyContent"
                              :placeholder="user?.id ? `回复 @${replyTo.user.profile.nickName}` : '先登录才能愉快的评论哦'">
                              <template #footer>
                                <div class="form-actions w-full">
                                  <button class="action-button cancel" @click="cancelReply">取消</button>
                                  <button class="submit-button" :disabled="!replyContent.trim()" @click="handleSubmit">
                                    回复
                                  </button>
                                </div>
                              </template>
                            </CommentInput>
                          </div>
                        </transition>
                      </div>
                    </div>
                  </div>
                </TransitionGroup>
                <div class="fold-box" v-if="comment.replyCount && comment.fold">
                  <span class="fold" @click="comment.fold = false">
                    {{ `展开 ${comment.replies.length} 条回复` }}</span>
                </div>
              </div>
              <div class="more" v-if="!comment.fold && comment.replies.length < (comment.replyCount || 0)"
                @click="loadMoreReplies(comment)">
                <Icon v-if="comment.loading" name="svg-spinners:90-ring-with-bg" size="1.2rem"></Icon>
                <span class="text-sm" v-else>加载更多 </span>
              </div>
            </div>
          </div>
        </TransitionGroup>
        <div class="more" v-if="comments.length < commentTotal" @click="loadMoreComments">
          <Icon v-if="commentLoading" name="svg-spinners:90-ring-with-bg" size="1.5rem"></Icon>
          <span v-else>加载更多 </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app';
import { ref, computed } from 'vue';
import { useUserStore } from '~/store';
import { storeToRefs } from 'pinia';
import { useIntersectionObserver } from '@vueuse/core';
import { TransitionGroup } from 'vue';
import ConfirmContent from '../ConfirmContent.vue';

import {
  type IReply,
  type Comment,
} from '@/types/index';
import {
  CommentTypeEnum,
  LikeEnum,
  CommentOrderEnum
} from '@/enum';

import {
  getReplyList,
  getParentComments,
  postComment,
  postReply,
  postDeleteComment,
  postDeleteReply,
  getCommentIdByReplyId,
  putUpdateComment,
  putUpdateReply
} from '~/api/comment';
import { postCancelLike, postLike } from '~/api';

import CommentInput from './Input.vue';
import CommentAvatar from './Avatar.vue';
import CommentCard from './CommentCard.vue';
import ReplyCard from './ReplyCard.vue';
import type { CommentForm, ReplyForm, ReplyTo } from '~/types/form';

const props = defineProps<{
  type: CommentTypeEnum;
  targetId: number;
  notify?: boolean;
}>();

const { user } = storeToRefs(useUserStore());
const { $toast } = useNuxtApp()
const route = useRoute();
const tabOptions = [
  { label: '最新', value: CommentOrderEnum.LATEST },
  { label: '最热', value: CommentOrderEnum.HOT },
];

const inputRefOne = ref();
const inputRefTwo = ref();
const inputRefThree = ref();

// 评论内容
const commentContent = ref('');
const replyContent = ref('');
const replyTo = ref<ReplyTo | null>(null);
const commentRef = ref<HTMLElement | null>(null);
const hasScrollToView = ref(false);
const showCommentFocus = ref(true)

const currentPage = ref(1);
const commentTotal = ref(0);
const PAGE_SIZE = 5;
const commentLoading = ref(false);
const commentOrder = ref<CommentOrderEnum>(CommentOrderEnum.LATEST);
const comments = ref<Array<Comment>>([]);
const tries = ref(0);
const MAX_TRIES = 10;

// 处理评论提交
const handleSubmit = (event: Event) => {
  event.preventDefault();
  if (!user.value) {
    $toast.warning('请先登录');
    return;
  }

  if (replyTo.value) {
    if (!replyContent.value.trim()) return
  } else {
    if (!commentContent.value.trim()) return;
  }

  if (replyTo.value) {
    const newReply: ReplyForm = {
      parentId: replyTo.value.parent.id,
      content: replyContent.value,
      replyId: user.value?.id,
      replyToId: replyTo.value.user.id,
      notify: props.notify,
    };
    postReply(newReply).then(res => {
      if (res.code === 200) {
        getReplies(replyTo.value!.parent);
        // 清空输入框和回复状态
        replyContent.value = '';
        replyTo.value = null;
      }
    });
  } else {
    const newComment: CommentForm = {
      type: props.type,
      targetId: props.targetId,
      content: commentContent.value,
      commenterId: user.value?.id,
      notify: props.notify
    };

    postComment(newComment).then(res => {
      if (res.code === 200) {
        currentPage.value = 1;
        getCommentList();
        // 清空输入框和回复状态
        commentContent.value = '';
        replyTo.value = null;
      }
    });
  }
};

// 处理回复
const handleReply = (comment: Comment, reply?: IReply) => {
  replyContent.value = '';
  replyTo.value = {
    id: reply?.id,
    parent: comment,
    user: reply ? reply.reply! : comment.commenter!,
  };
};

// 取消回复
const cancelReply = () => {
  replyTo.value = null;
  commentContent.value = '';
};

const handleRevokeComment = (comment: Comment) => {
  $toast.custom(
    h(markRaw(ConfirmContent), {
      title: '确定要撤回吗？不能再恢复哦！',
      submit: async () => {
        postDeleteComment(comment.id).then(() => {
          currentPage.value - 1
          getCommentList();
          $toast.success('撤回成功');
        });
      },
    }),
    {
      duration: Infinity,
      position: 'top-center',
    },
  )

};

const handleRevokeReply = (parent: Comment, reply: IReply) => {
  $toast.custom(
    h(markRaw(ConfirmContent), {
      title: '确定要撤回吗？不能再恢复哦！',
      submit: async () => {
        postDeleteReply(reply.id).then(() => {
          getReplies(parent);
          $toast.success('撤回成功');
        });
      },
    }),
    {
      duration: Infinity,
      position: 'top-center',
    },
  )

};

// 处理点赞
const handleLikeComment = (comment: Comment) => {
  if (comment.isLike) {
    postCancelLike({
      userId: user?.value?.id,
      targetId: comment.id,
      type: LikeEnum.COMMENT,
    }).then(() => {
      comment.likeCount--;
      comment.isLike = false;
    });
  } else {
    postLike({
      userId: user?.value?.id,
      targetId: comment.id,
      type: LikeEnum.COMMENT,
    }).then(() => {
      comment.likeCount++;
      comment.isLike = true;
    });
  }
};

const handleEditComment = (comment: Comment, content: string) => {
  putUpdateComment(comment.id, content).then(() => {
    comment.content = content;
    comment.updatedAt = new Date();
    $toast.success('保存成功');
  });
};

const handleEditReply = (reply: IReply, content: string) => {
  putUpdateReply(reply.id, content).then(() => {
    reply.content = content;
    reply.updatedAt = new Date();
    $toast.success('保存成功');
  });
};

// 处理点赞
const handleLikeReply = (comment: IReply) => {
  if (comment.isLike) {
    postCancelLike({
      userId: user?.value?.id,
      targetId: comment.id,
      type: LikeEnum.REPLY,
    }).then(() => {
      comment.likeCount--;
      comment.isLike = false;
    });
  } else {
    postLike({
      userId: user?.value?.id,
      targetId: comment.id,
      type: LikeEnum.REPLY,
    }).then(() => {
      comment.likeCount++;
      comment.isLike = true;
    });
  }
};

function loadMoreComments() {
  currentPage.value += 1;
  getCommentList();
}

async function loadMoreReplies(parent: Comment, targetId?: number) {
  const len = parent.replies ? parent.replies.length : 0;
  const currentPage = Math.floor(len / PAGE_SIZE) + 1;
  parent.loading = true;
  const res = await getReplyList({
    parentId: parent.id,
    currentPage,
    pageSize: PAGE_SIZE,
  });

  const { list } = res.data;
  parent.fold = false;
  parent.loading = false;
  parent.replies = parent.replies && parent.replies.length ? parent.replies.concat([...list]) : list;

  if (targetId && tries.value < MAX_TRIES) {
    tries.value += 1
    const targetReply = list.find(l => l.id === targetId)
    if (targetReply) {
      setTimeout(() => {
        navigateToTarget('reply' + routerReplyId.value);
      }, 500)
    } else {
      await loadMoreReplies(parent, targetId)
    }
  }
}

function returnReplies(replies: IReply[], fold: boolean): IReply[] {
  return fold ? replies.slice(0, 0) : replies;
}

async function getReplies(parent: Comment) {
  const currentPage = 1;
  const res = await getReplyList({
    parentId: parent.id,
    currentPage,
    pageSize: PAGE_SIZE,
  });

  const replies = res.data.list;
  parent.fold = false;
  parent.replyCount = res.data.total;
  parent.replies = replies;
}

const toggleTab = (tab: string) => {
  commentOrder.value = tab as CommentOrderEnum;
  currentPage.value = 1;
  getCommentList();
};

async function getCommentList(commentId?: number) {
  commentLoading.value = true;
  const res = await getParentComments({
    currentPage: currentPage.value,
    pageSize: PAGE_SIZE,
    targetId: props.targetId,
    type: props.type,
    commentOrder: commentOrder.value,
  });
  const { list, total } = res.data;
  const listWidthFold = list.map(v => {
    return {
      ...v,
      loading: false,
      fold: v.id !== commentId
    };
  });

  comments.value = currentPage.value === 1 ? listWidthFold : comments.value.concat(listWidthFold);
  commentTotal.value = total - 0;
  commentLoading.value = false;

  if (commentId && tries.value < MAX_TRIES) {
    tries.value += 1
    const targetComment = comments.value.find(item => item.id === commentId)
    if (!targetComment) {
      if (comments.value.length < commentTotal.value) {
        currentPage.value += 1
        await getCommentList(commentId)
      }
    } else {
      if (routerReplyId.value) {
        if (targetComment.replies.find(r => r.id === routerReplyId.value)) {
          setTimeout(() => {
            navigateToTarget('reply' + routerReplyId.value);
          })
        } else {
          loadMoreReplies(targetComment, routerReplyId.value)
        }
      } else {
        setTimeout(() => {
          navigateToTarget('comment' + commentId);
        }, 500);
      }
    }
  }
}

// 判断是否带 replyId commentId
const routerReplyId = computed(() => {
  return Number(route.query.replyId) || undefined;
});

const routerCommentId = computed(() => {
  return Number(route.query.commentId) || undefined;
});

const target = useTemplateRef<HTMLDivElement>('commentRef')

function loadComment() {
  const { stop } = useIntersectionObserver(
    target,
    ([entry]) => {
      if (entry && entry.isIntersecting) {
        getCommentList();
        stop();
      }
    },
    {
      rootMargin: '0% 0% 40% 0%',
    }
  )
}

function navigateToTarget(target: string) {
  const element = document.getElementById(target);
  const scrollTop = element?.getBoundingClientRect().top || 0;
  const offsetHeight = element?.offsetHeight || 0;
  window.scrollBy({ top: scrollTop + offsetHeight, behavior: 'smooth' });
  requestAnimationFrame(() => {
    hasScrollToView.value = true;
    setTimeout(() => {
      showCommentFocus.value = false
    }, 3000)
  });
}

function clickOutside(e: any) {
  inputRefOne.value && inputRefOne.value.blur();
  inputRefTwo.value && inputRefTwo.value.blur();
  inputRefThree.value && inputRefThree.value.blur();
}

onMounted(async () => {
  if (window) {
    if (routerReplyId.value) {
      const res = await getCommentIdByReplyId(routerReplyId.value)
      const commentId = res.data
      if (commentId) {
        await getCommentList(commentId)
      }
    }
    else if (routerCommentId.value) {
      await getCommentList(routerCommentId.value)
    } else {
      loadComment()
    }
  }
});
</script>

<style lang="scss" scoped>
.comments-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;

  color: var(--primary-color);
}

.comments-list {
  .no-comments {
    text-align: center;
    padding: 1rem;

    color: var(--text-light-color);
  }
}

.comment-item {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;

  &:last-child {
    border-bottom: none;
  }

  .fold {
    cursor: pointer;
    transition: color $duration ease;
    font-size: 14px;
    font-size: 0.8rem;
    color: var(--primary-color);

    &:hover {
      color: var(--secondary-color);
    }
  }
}

.comment-avatar-box {
  width: 42px;
  display: flex;
  justify-content: center;
}

.comment-content {
  flex: 1;
}

.replies-list {
  margin-top: 0.5rem;
}

.reply-item {
  margin-bottom: 0.8rem;

  &:last-child {
    margin-bottom: 0;
  }

  &-box {
    display: flex;
    gap: 1rem;
  }
}

.reply-content {
  flex: 1;
}

.comment-form {
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--bg-color);

  .form-content {
    display: flex;
  }

}

.more {
  text-align: center;
  cursor: pointer;
  transition: color $duration ease;
  margin: 0.3em 0;
  font-size: 1rem;
  height: 20px;

  color: var(--primary-color);

  &:hover {
    color: var(--secondary-color);
  }
}

.focus-comment {
  background: transparent;
  animation: outline ease-in-out 3s;
}

@keyframes outline {
  40% {
    border-radius: 3px;
    background: rgba(255, 0, 0, 0.1);
  }

  100% {
    border-radius: 3px;
    background: rgba(255, 0, 0, 0.1);
  }
}
</style>
