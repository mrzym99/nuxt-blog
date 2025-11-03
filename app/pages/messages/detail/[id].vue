<template>
  <Card>
    <Back class="back" />
    <div class="message flex flex-col gap-2" v-if="data">
      <div class="flex justify-between mb-2">
        <div class="flex items-center gap-4">
          <UserAvatar v-if="data.user" class="mr-2" :id="data.user.id" :nick-name="data.user.profile.nickName"
            :avatar="data.user.profile.avatar" />
          <span v-else>
            {{ data.nickName }}
          </span>
          <IpAddress :ip="data.ipAddress" />
        </div>
        <div>
          <ClientOnly>
            <button class="text-sm link mr-1" v-if="canDelete(data.user?.id)" @click="handleRevokeMessage">撤回</button>
            <button class="text-sm link" v-if="canEdit(data.user?.id)" @click="editMessage">编辑</button>
          </ClientOnly>
        </div>
      </div>
      <NuxtLink class="text-sm" :to="`/messages/detail/${data.id}`">
        <RichTextRender class="!text-1rem" :content="data.content" :id="data.id" :type="ContentTypeEnum.MESSAGE" />
      </NuxtLink>
      <div class="flex justify-between gap-2 items-center text-[12px]">
        <span>{{ formatDate(data.createdAt) }}</span>
        <MessageTypeLabel class="!px-3px !py-2px" :type="messageTypeMap[data.type]" :show-active="true" />
      </div>
    </div>
    <Comments v-if="data" :type="CommentTypeEnum.MESSAGE" :target-id="data.id" notify />
    <MessageForm v-model="showEditMessageModal" :type-options="types" :message="data" @success="editSuccess" />
  </Card>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { deleteMessage, getMessageInfo, getMessageTypes } from '~/api';
import { useAsyncData } from '#app';
import { MessageTypeEnum, ContentTypeEnum, CommentTypeEnum } from '~/enum';
import MessageTypeLabel from '../components/type.vue';
import type { MessageType } from '~/types/message';
import { useAppStore, useUserStore } from '~/store';
import MessageForm from '../components/form.vue';
import IpAddress from '~/components/IpAddress.vue';
import Comments from '~/components/Comment/index.vue';
import ConfirmContent from '~/components/ConfirmContent.vue';

defineOptions({
  name: 'MessageDetail',
});

const { $toast } = useNuxtApp();
const { user } = storeToRefs(useUserStore());
const route = useRoute();
const router = useRouter();

const { data, refresh } = await useAsyncData('messageDetail', async () => {
  const id = route.params.id as unknown as number;
  if (!id) return;
  const res = await getMessageInfo(id);

  return res.data
});

const { data: types } = await useAsyncData('message-types', async () => {
  const { data } = await getMessageTypes();
  return data;
});

const allMessageTypes = computed(() => {
  return [{
    label: '全部',
    value: MessageTypeEnum.ALL,
  }].concat([...types.value || []])
});

const messageTypeMap = computed(() => {
  return allMessageTypes.value.reduce((acc, cur) => {
    acc[cur.value] = cur;
    return acc;
  }, {} as Record<MessageTypeEnum, MessageType>)
});

const canEdit = (uid?: number) => {
  return (uid && user.value && user.value.id === uid) || data.value?.own
}

const canDelete = (uid?: number) => {
  return user.value?.roles.includes('admin') || (uid && user.value && user.value.id === uid) || data.value?.own
}

const showEditMessageModal = ref(false);
function editMessage() {
  showEditMessageModal.value = true;
}

function editSuccess() {
  refresh();
  useAppStore().setRefresh(true);
}

const handleRevokeMessage = () => {
  if (!data.value) return;
  $toast.custom(
    h(markRaw(ConfirmContent), {
      title: '确定要撤回吗？不能再恢复哦！',
      submit: async () => {
        deleteMessage(data.value!.id).then(() => {
          router.back()
          $toast.success('撤回成功');
          useAppStore().setRefresh(true);
        });
      },
    }),
    {
      duration: Infinity,
      position: 'top-center',
    },
  )
};
</script>

<style lang="scss" scoped>
.message {
  padding: 1rem;
  margin: 1rem 0;
  background-color: var(--light-bg-color);
}
</style>
