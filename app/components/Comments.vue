<template>
  <div ref="commentRef" class="comments-section">
    <!-- 评论列表 -->
    <div class="comments-list">
      <!-- 主评论输入框 -->
      <div class="comment-form">
        <div class="form-header">
          <div class="avatar">
            <NuxtLink v-if="user" :to="`/user-center/${user?.id}`">
              <img :src="user?.avatar" :alt="user?.nickName" />
            </NuxtLink>
            <NuxtLink class="to-login" to="/login/pwd-login">登录</NuxtLink>
          </div>
          <div class="form-content">
            <div class="markdown-toolbar">
              <button class="tool-btn" @click="insertText('**', '**')" title="加粗">
                <Icon name="carbon:text-bold" />
              </button>
              <button class="tool-btn" @click="insertText('*', '*')" title="斜体">
                <Icon name="carbon:text-italic" />
              </button>
              <button class="tool-btn" @click="insertText('__', '__')" title="下划线">
                <Icon name="carbon:text-underline" />
              </button>
              <button class="tool-btn" @click="insertText('> ')" title="引用">
                <Icon name="carbon:quotes" />
              </button>
              <button class="tool-btn" @click="insertText('`', '`')" title="代码">
                <Icon name="carbon:code" />
              </button>
              <button class="tool-btn" @click="insertText('```\n', '\n```')" title="代码块">
                <Icon name="carbon:code-block" />
              </button>
              <button class="tool-btn" @click="insertText('@')" title="@用户">
                <Icon name="carbon:user-avatar" />
              </button>
              <button class="tool-btn" @click="triggerImageUpload" title="插入图片">
                <Icon name="carbon:image" />
              </button>
              <input
                type="file"
                ref="imageInput"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
              />
            </div>
            <textarea
              v-model="commentContent"
              placeholder="写下你的评论..."
              rows="3"
              @keydown.enter="handleSubmit"
            ></textarea>
            <div class="form-footer">
              <div class="form-tools">
                <Popover position="bottom" :offset="8" :width="380">
                  <template #trigger>
                    <button class="tool-btn">😊</button>
                  </template>
                  <div class="emoji-picker">
                    <div class="emoji-list">
                      <span
                        v-for="emoji in emojis"
                        :key="emoji"
                        class="emoji-item"
                        @click="insertEmoji(emoji)"
                      >
                        {{ emoji }}
                      </span>
                    </div>
                  </div>
                </Popover>
                <Popover position="bottom-left" :offset="8">
                  <template #trigger>
                    <button class="preview-button flex items-center">
                      <Icon name="ph:eye" size="1.25rem" />
                    </button>
                  </template>
                  <div class="preview-panel">
                    <div class="w-300px min-h-10rem" v-html="renderedContent"></div>
                  </div>
                </Popover>
              </div>
              <div class="form-actions">
                <button class="submit-btn" :disabled="!commentContent.trim()" @click="handleSubmit">
                  发表评论
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="comments.length === 0" class="no-comments">暂无评论，快来抢沙发吧！</div>
      <template v-else>
        <Tab v-model="commentOrder" :options="tabOptions" @change="toggleTab" />
        <TransitionGroup name="fade">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="comment-item"
            :class="{
              'focus-comment': hasScrollToView && routerCommentId && comment.id === routerCommentId,
            }"
          >
            <div class="comment-avatar">
              <NuxtLink :to="`/user-center/${comment.commenter?.id}`">
                <img
                  :src="comment.commenter?.profile.avatar"
                  :alt="comment.commenter?.profile.nickName"
                />
              </NuxtLink>
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="username">{{ comment.commenter?.profile.nickName }}</span>
                <span class="time">{{ formatTime(comment?.createdAt) }}</span>
              </div>
              <div class="comment-text" v-html="renderComment(comment.content)"></div>
              <div class="comment-actions">
                <button class="action-btn" @click="handleReply(comment)">回复</button>
                <button
                  v-if="user?.id === comment.commenter?.id"
                  class="cancel-btn"
                  @click="handleRevokeComment(comment)"
                >
                  撤回
                </button>
                <button
                  :class="{
                    like: comment.isLike,
                  }"
                  class="action-btn"
                  @click="handleLikeComment(comment)"
                >
                  <Icon name="ph:thumbs-up-duotone" class="size-1rem mr-1" />
                  {{ comment.likeCount ? comment.likeCount : 0 }}
                </button>
              </div>

              <!-- 子评论列表 -->
              <div v-if="comment.replyCount" class="replies-list">
                <div
                  v-for="reply in returnReplies(comment.replies, comment.fold)"
                  :key="reply.id"
                  class="reply-item"
                  :class="{
                    'focus-comment': hasScrollToView && routerReplyId && reply.id === routerReplyId,
                  }"
                >
                  <div class="reply-avatar">
                    <NuxtLink :to="`/user-center/${reply.reply?.id}`">
                      <img :src="reply.reply.profile.avatar" :alt="reply.reply.profile.nickName" />
                    </NuxtLink>
                  </div>
                  <div class="reply-content">
                    <div class="reply-header">
                      <span class="username">{{ reply.reply.profile.nickName }}</span>
                      <span v-if="reply.replyTo" class="reply-to">
                        回复
                        <span class="reply-to-user">@{{ reply.replyTo.profile.nickName }}</span>
                      </span>
                      <span class="time">{{ formatTime(reply?.createdAt) }}</span>
                    </div>
                    <div class="reply-text" v-html="renderComment(reply.content)"></div>
                    <div class="reply-actions">
                      <button class="action-btn" @click="handleReply(comment, reply)">回复</button>

                      <button
                        v-if="user?.id === reply.reply?.id"
                        class="cancel-btn"
                        @click="handleRevokeReply(comment, reply)"
                      >
                        撤回
                      </button>
                      <button
                        :class="{
                          like: reply.isLike,
                        }"
                        class="action-btn"
                        @click="handleLikeReply(reply)"
                      >
                        <Icon name="ph:thumbs-up-duotone" class="size-1rem mr-1" />
                        {{ reply.likeCount ? reply.likeCount : '' }}
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  class="more"
                  v-if="comment.replies.length < (comment.replyCount || 0)"
                  @click="loadMoreReplies(comment)"
                >
                  <Icon
                    v-if="comment.loading"
                    name="svg-spinners:90-ring-with-bg"
                    size="1.5rem"
                  ></Icon>
                  <span v-else>加载更多 </span>
                </div>
              </div>
              <div class="fold-box" v-if="comment.replyCount && comment.replyCount > 2">
                <span class="fold" @click="comment.fold = !comment.fold">
                  {{ comment.fold ? '展开' : '收起' }}</span
                >
              </div>

              <!-- 回复框 -->
              <div v-if="replyTo && replyTo.parent.id === comment.id" class="reply-form">
                <div class="form-header">
                  <div class="avatar">
                    <NuxtLink :to="`/user-center/${user?.id}`">
                      <img :src="user?.avatar" :alt="user?.nickName" />
                    </NuxtLink>
                  </div>
                  <div class="form-content">
                    <textarea
                      v-model="commentContent"
                      :placeholder="`回复 @${replyTo.user.profile.nickName}`"
                      rows="3"
                      @keydown.enter="handleSubmit"
                    ></textarea>
                    <div class="form-footer">
                      <div class="form-actions">
                        <button class="cancel-btn" @click="cancelReply">取消</button>
                        <button
                          class="reply-btn"
                          :disabled="!commentContent.trim()"
                          @click="handleSubmit"
                        >
                          回复
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
import { ref, computed, nextTick } from 'vue';
import Popover from './Popover.vue';
import { marked } from 'marked';
import {
  type IReply,
  CommentType,
  type IUser,
  type CreateReply,
  type CreateComment,
  type Comment,
  LikeType,
  CommentOrder,
} from '@/types/index';
import { useUserStore } from '~/store';
import { storeToRefs } from 'pinia';
import {
  getReplyList,
  getParentComments,
  postComment,
  postReply,
  postDeleteComment,
  postDeleteReply,
} from '~/api/comment';
import { useNuxtApp } from '#app';
import { postCancelLike, postLike, uploadImg } from '~/api';
import FormData from 'form-data';
import Tab from './Tab.vue';
import { emojiList } from '~/assets/constant/emoji';

const props = defineProps<{
  type: CommentType;
  targetId: number;
}>();

type ReplyTo = {
  parent: Comment;
  user: IUser;
};

const { user } = storeToRefs(useUserStore());
// const toast = useToast();
const route = useRoute();
const tabOptions = [
  { label: '最新', value: CommentOrder.LATEST },
  { label: '最热', value: CommentOrder.HOT },
];

// 评论内容
const commentContent = ref('');
const replyTo = ref<ReplyTo | null>(null);
const imageInput = ref<HTMLInputElement | null>(null);
const commentRef = ref<HTMLElement | null>(null);
let observer: any = null;
const hasScrollToView = ref(false);

const currentPage = ref(1);
const commentTotal = ref(0);
const PAGE_SIZE = 5;
const commentLoading = ref(false);
const commentOrder = ref<string>(CommentOrder.LATEST);

// 表情列表
const emojis = emojiList;

// 模拟评论数据
const comments = ref<Array<Comment>>([]);

const renderer = new marked.Renderer();

renderer.image = ({ href, title, text }: any) => {
  return `<img src="${href}" alt="${text}" title="${title}" style="max-height: 20rem;object-fit: cover;" />`;
};

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  if (!commentContent.value) return '';
  return marked.parse(commentContent.value, { renderer });
});

const renderComment = (comment: string) => {
  return marked.parse(comment, { renderer });
};
// 处理评论提交
const handleSubmit = (event: any) => {
  if (event.ctrlKey || event.metaKey) {
    commentContent.value += '\n';
    return;
  }
  event.preventDefault();
  if (!commentContent.value.trim()) return;
  if (!user.value) {
    // toast.warning({ message: '请先登录' });
    return;
  }
  if (replyTo.value) {
    const newReply: CreateReply = {
      parentId: replyTo.value.parent.id,
      content: commentContent.value,
      replyId: user.value?.id,
      replyToId: replyTo.value.user.id,
    };
    postReply(newReply).then(res => {
      if (res.code === 200) {
        getReplies(replyTo.value!.parent);
        // 清空输入框和回复状态
        commentContent.value = '';
        replyTo.value = null;
      }
    });
  } else {
    const newComment: CreateComment = {
      type: props.type,
      targetId: props.targetId,
      content: commentContent.value,
      commenterId: user.value?.id,
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
  replyTo.value = {
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
  postDeleteComment(comment.id).then(() => {
    comments.value = comments.value.filter(item => item.id !== comment.id);
    // toast.success({ message: '撤回成功' });
  });
};

const handleRevokeReply = (parent: Comment, reply: IReply) => {
  postDeleteReply(reply.id).then(() => {
    getReplies(parent);
    // toast.success({ message: '撤回成功' });
  });
};

// 处理点赞
const handleLikeComment = (comment: Comment) => {
  if (comment.isLike) {
    postCancelLike({
      userId: user?.value?.id,
      targetId: comment.id,
      type: LikeType.COMMENT,
    }).then(() => {
      comment.likeCount--;
      comment.isLike = false;
    });
  } else {
    postLike({
      userId: user?.value?.id,
      targetId: comment.id,
      type: LikeType.COMMENT,
    }).then(() => {
      comment.likeCount++;
      comment.isLike = true;
    });
  }
};

// 处理点赞
const handleLikeReply = (comment: IReply) => {
  if (comment.isLike) {
    postCancelLike({
      userId: user?.value?.id,
      targetId: comment.id,
      type: LikeType.REPLY,
    }).then(() => {
      comment.likeCount--;
      comment.isLike = false;
    });
  } else {
    postLike({
      userId: user?.value?.id,
      targetId: comment.id,
      type: LikeType.REPLY,
    }).then(() => {
      comment.likeCount++;
      comment.isLike = true;
    });
  }
};

// 插入表情
const insertEmoji = (emoji: string) => {
  commentContent.value += emoji;
};

// 格式化时间
const formatTime = (date?: Date | null | undefined) => {
  if (!date) return null;
  const now = new Date().getTime();
  const diff = now - new Date(date!).getTime();

  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`;
  return date!.toLocaleDateString();
};

// 插入文本
const insertText = (before: string, after: string = '') => {
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selectedText = text.substring(start, end);

  const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
  commentContent.value = newText;

  // 恢复光标位置
  nextTick(() => {
    textarea.focus();
    textarea.setSelectionRange(start + before.length, end + before.length);
  });
};

// 触发图片上传
const triggerImageUpload = () => {
  imageInput.value?.click();
};

// 处理图片上传
const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append('image', file);
    const res = await uploadImg(formData);
    insertText(`![${file.name}](${res.data})`);
  } catch (error) {
    console.error('图片上传失败:', error);
  } finally {
    input.value = '';
  }
};

function loadMoreComments() {
  currentPage.value += 1;
  getCommentList();
}

async function loadMoreReplies(parent: Comment) {
  const len = parent.replies ? parent.replies.length : 0;
  const currentPage = Math.floor(len / PAGE_SIZE) + 1;
  parent.loading = true;
  const res = await getReplyList({
    parentId: parent.id,
    currentPage,
    pageSize: PAGE_SIZE,
  });

  const replies = res.data.list;
  parent.fold = false;
  parent.loading = false;
  parent.replies = parent.replies ? parent.replies.concat(replies) : replies;
}

function returnReplies(replies: IReply[], fold: boolean): IReply[] {
  return fold ? replies.slice(0, 2) : replies;
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
  commentOrder.value = tab;
  currentPage.value = 1;
  getCommentList();
};

async function getCommentList() {
  commentLoading.value = true;
  const res = await getParentComments({
    currentPage: currentPage.value,
    pageSize: PAGE_SIZE,
    targetId: props.targetId,
    type: CommentType.ARTICLE,
    commentOrder: commentOrder.value,
  });
  const { list, total } = res.data;
  const listWidthFold = list.map(v => {
    return {
      ...v,
      loading: false,
      fold: true,
    };
  });
  comments.value = currentPage.value === 1 ? listWidthFold : comments.value.concat(listWidthFold);
  commentTotal.value = total - 0;
  commentLoading.value = false;
}

// 判断是否带 replyId commentId
const routerReplyId = computed(() => {
  return Number(route.query.replyId) || null;
});

const routerCommentId = computed(() => {
  return Number(route.query.commentId) || null;
});

onMounted(() => {
  if (window.IntersectionObserver) {
    observer = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            getCommentList();
            observer.unobserve(entry.target);
            observer.disconnect();
            observer = null;
            window &&
              window.setTimeout(() => {
                hasScrollToView.value = true;
              }, 500);
          }
        });
      },
      {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0.1,
      }
    );
    observer.observe(commentRef.value);
  }

  if (window) {
    if (routerReplyId.value || routerCommentId.value) {
      commentRef.value?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
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
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid;

  border-color: var(--border-color);

  &:last-child {
    border-bottom: none;
  }

  .fold {
    cursor: pointer;
    transition: color 0.3s ease;
    font-size: 14px;
    margin-left: 0.25rem;

    color: var(--primary-color);

    &:hover {
      color: var(--secondary-color);
    }
  }
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.comment-content {
  flex: 1;

  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .username {
    font-weight: 500;

    color: var(--text-color);
  }

  .time {
    font-size: 0.875rem;

    color: var(--text-light-color);
  }

  .comment-text {
    color: var(--text-color);
  }

  .comment-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .action-btn {
    display: flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 0.875rem;

    color: var(--text-light-color);

    &:hover {
      color: var(--primary-color);
    }
  }
}

.replies-list {
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px solid;

  border-color: var(--border-color);
}

.reply-item {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid;

  border-color: var(--border-color);

  &:last-child {
    border-bottom: none;
  }
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.reply-content {
  flex: 1;

  .reply-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .reply-to {
    font-size: 0.875rem;

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
  }
}

.form-actions {
  display: flex;
  gap: 0.5rem;
}

.cancel-btn {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--error-color);
}

.reply-btn {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.875rem;

  color: var(--text-light-color);

  &:hover {
    color: var(--primary-color);
  }
}

.reply-form {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 0.5rem;

  background-color: var(--bg-color);
  border: 1px solid var(--border-color);

  .form-header {
    display: flex;
    gap: 0.5rem;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .form-content {
    flex: 1;

    textarea {
      width: 100%;
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid;
      resize: vertical;
      white-space: pre-wrap;

      background-color: var(--bg-color);
      border-color: var(--border-color);
      color: var(--text-color);

      &:focus {
        outline: none;
        border-color: var(--primary-color);
      }
    }
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
}

.comment-form {
  margin-bottom: 1rem;
  padding: 0.8rem;
  border-radius: 0.5rem;

  background-color: var(--bg-color);
  border: 1px solid var(--border-color);

  .form-header {
    display: flex;
    gap: 0.5rem;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .to-login {
    cursor: pointer;
    display: flex !important;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    transition: all 0.3s ease;

    color: var(--nav-text-color) !important;
    background-color: var(--primary-color);

    &:hover {
      background-color: var(--secondary-color);
    }
  }

  .form-content {
    flex: 1;

    .markdown-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      margin-bottom: 0.5rem;
      padding: 0.5rem;
      border-radius: 0.5rem;

      background-color: var(--bg-color);
      border: 1px solid var(--border-color);

      .tool-btn {
        padding: 0.25rem;
        border: none;
        background: none;
        cursor: pointer;
        border-radius: 0.25rem;
        transition: all 0.3s ease;

        i {
          width: 1rem;
          height: 1rem;

          color: var(--text-color);

          &:hover {
            color: var(--primary-color);
          }
        }

        i {
          font-size: 1.25rem;
        }
      }
    }

    textarea {
      width: 100%;
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid;
      resize: vertical;

      background-color: var(--bg-color);
      border-color: var(--border-color);
      color: var(--text-color);

      &:focus {
        outline: none;
        border-color: var(--primary-color);
      }
    }
  }

  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
  }

  .form-tools {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .tool-btn {
    padding: 0.25rem 0.5rem;
    border: none;
    background: none;
    cursor: pointer;

    color: var(--text-light-color);

    &:hover {
      color: var(--primary-color);
    }
  }

  .submit-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;

    background-color: var(--primary-color);
    color: white;

    &:disabled {
      background-color: var(--border-color);
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  }
}

.emoji-picker {
  .emoji-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.5rem;
    max-height: 20rem;
    overflow: auto;
  }

  .emoji-item {
    cursor: pointer;
    padding: 0.25rem;
    font-size: 1.2rem;

    &:hover {
      color: var(--primary-color);
    }
  }
}

.preview-panel {
  padding: 1rem;

  .preview-title {
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.75rem;

    color: var(--text-color);
  }

  .preview-content {
    max-height: 300px;
    overflow-y: auto;
    padding: 0.5rem;
    border-radius: 0.5rem;

    background-color: var(--bg-color);
    border: 1px solid var(--border-color);

    :deep(p) {
      margin: 0.5em 0;
    }

    :deep(code) {
      padding: 0.2em 0.4em;
      border-radius: 0.25rem;
      font-family: monospace;
    }

    :deep(pre) {
      padding: 1em;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin: 1em 0;

      code {
        background-color: transparent;
        padding: 0;
      }
    }

    :deep(blockquote) {
      margin: 1em 0;
      padding-left: 1em;

      color: var(--text-light-color);
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 1.5em;
      margin: 0.5em 0;
    }

    :deep(a) {
      color: var(--primary-color);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
      margin: 0.5em 0;
    }

    :deep(table) {
      border-collapse: collapse;
      width: 100%;
      margin: 0.5em 0;

      th,
      td {
        border: 1px solid var(--border-color);
        padding: 0.5em;
        text-align: left;
      }

      th {
        background-color: var(--border-color);
      }
    }
  }
}

.more {
  text-align: center;
  cursor: pointer;
  transition: color 0.3s ease;
  margin: 1em 0;
  font-size: 16px;
  height: 20px;

  color: var(--primary-color);

  &:hover {
    color: var(--secondary-color);
  }
}

.focus-comment {
  outline: 2px solid transparent;
  background: transparent;
  animation: outline ease-in-out 1.2s;
}

@keyframes outline {
  100% {
    border-radius: 3px;
    outline-color: var(--primary-color);
    background: rgba(255, 0, 0, 0.1);
  }
}
</style>
