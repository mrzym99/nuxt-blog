<template>
  <div class="message pt-1rem px-1rem">
    <!-- Blog Messages -->
    <main>
      <div class="type-cloud">
        <MessageTypeLabel v-for="item in allMessageTypes" :key="item.value" :show-active="true" :type="item" />
      </div>
      <div class="leave flex justify-end items-center mb-2rem">
        <button class="link text-1.2rem" @click="leaveMessage">留言 </button>
      </div>
      <Loading :loading="initLoading">
        <div>
          <article v-for="message in data?.list" :key="message.id" class="message-item">
            <div class="flex flex-col gap-2">
              <div class="flex justify-between">
                <div class="flex items-center gap-4 mb-2">
                  <UserAvatar v-if="message.user" :id="message.user.id" :nick-name="message.user.profile.nickName"
                    :avatar="message.user.profile.avatar" />
                  <span v-else>
                    {{ message.nickName }}
                  </span>
                  <IpAddress :ip="message.ipAddress" />
                </div>
                <div class="text-sm link">
                  <NuxtLink :to="`/messages/detail/${message.id}`">
                    查看
                  </NuxtLink>
                </div>
              </div>
              <NuxtLink class="text-sm px-1rem" :to="`/messages/detail/${message.id}`">
                <RichTextRender :content="message.content" :id="message.id" :type="ContentTypeEnum.MESSAGE" />
              </NuxtLink>
              <div class="flex items-center text-[12px]">
                <span>{{ formatDate(message.createdAt) }}</span>
              </div>
            </div>
          </article>
        </div>
        <ScrollLoading ref="target" :loading="loading" :empty="!data?.list.length" empty-text="暂无留言"
          :full-loaded="fullLoaded" />
      </Loading>
    </main>
    <MessageForm v-model="showLeaveMessageModal" :type="type" :type-options="types" @success="fullRefresh" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { getMessages, getMessageTypes } from '~/api';
import { useAsyncData } from '#app';
import { PAGE_SIZE, ALL } from '~/constants';
import { ContentTypeEnum, MessageTypeEnum } from '~/enum';
import MessageForm from './components/form.vue';
import { useIntersectionObserver } from '@vueuse/core';
import MessageTypeLabel from './components/type.vue'
import { useRefresh } from '~/hooks/useRefresh';
import { useAppStore } from '~/store';

defineOptions({
  name: 'Message',
});

definePageMeta({
  key: 'Message',
  middleware: ['refresh-same-route']
});

const route = useRoute();
const { getRefresh } = storeToRefs(useAppStore());
const target = useTemplateRef<HTMLDivElement>('target')
const type = computed(() => {
  const t = route.params.slug as string
  return t === ALL ? '' : t
});
const currentPage = ref(1);
const loading = ref(false);
const initLoading = ref(false);

const { data: types } = await useAsyncData('message-types', async () => {
  const { data } = await getMessageTypes();
  return data;
});

const { data, refresh } = await useAsyncData('messages', async () => {
  initLoading.value = true;
  const t = route.params.slug as string
  const res = await getMessages({
    currentPage: currentPage.value,
    pageSize: PAGE_SIZE,
    type: t === ALL ? '' : t,
  });
  initLoading.value = false;
  return {
    list: res.data.list,
    total: res.data.total,
  }
});

const allMessageTypes = computed(() => {
  return [{
    label: '全部',
    value: MessageTypeEnum.ALL,
  }].concat([...types.value || []])
});



const messages = computed(() => {
  return data.value?.list || []
});

async function loadMore() {
  currentPage.value += 1
  loading.value = true
  const res = await getMessages({
    currentPage: currentPage.value,
    pageSize: PAGE_SIZE,
    type: type.value
  });

  const {
    list, total
  } = res.data;

  data.value = {
    list: [...messages.value, ...list.map((item) => ({
      ...item,
      slug: '/posts/' + item.id,
    }))],
    total: total,
  };
  loading.value = false
}

const fullLoaded = computed(() => {
  return messages.value.length === (data.value?.total ?? 0)
});

function infiniteScroll() {
  const { stop } = useIntersectionObserver(
    target,
    ([entry]) => {
      if (entry && entry.isIntersecting) {
        if (messages.value.length < (data.value?.total ?? 0)) {
          loadMore();
        } else {
          stop();
        }
      }
    },
    {
      rootMargin: '0% 0% 40% 0%',
    }
  )
}

const showLeaveMessageModal = ref(false);
function leaveMessage() {
  showLeaveMessageModal.value = true;
}

async function fullRefresh() {
  currentPage.value = 1;
  await refresh();
  infiniteScroll();
}


onMounted(() => {
  infiniteScroll();
});

onActivated(() => {
  if (getRefresh.value) {
    fullRefresh();
    useAppStore().setRefresh(false);
  }
});

useRefresh(route.name as string, route.params.slug as string, fullRefresh)
</script>

<style lang="scss" scoped>
.type-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 14px;
}

.message-item {
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
  }
}
</style>
