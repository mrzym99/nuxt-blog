<template>
  <ClientOnly>
    <Modal :title="message ? '编辑留言' : '新增留言'" v-model="modelValue" @close="handleClose">
      <VeeForm class="normal-form mx-auto mb-0 w-700px lt-md:w-full" @submit="handleSubmit">
        <div class="block gap-[2rem] md:flex">
          <div class="flex-1">
            <div class="form-block mb-3 flex" v-if="!user">
              <label for="nickName">昵称</label>
              <div class="form-item">
                <div class="w-full">
                  <VeeField class="w-[200px]" v-model="messageForm.nickName" name="昵称" placeholder="请输入昵称"
                    rules="required|min:2" />
                </div>
                <Transition name="fade">
                  <VeeErrorMessage class="error-message" name="昵称" key="nickName" />
                </Transition>
              </div>
            </div>
            <div class="form-block mb-3 flex">
              <label for="type">留言类型</label>
              <div class="form-item flex items-center">
                <span class="mr-1rem flex items-center" v-for="option in (typeOptions ?? [])" :key="option.value">
                  <VeeField class="radio" v-model="messageForm.type" name="留言类型" type="radio" :value="option.value" />
                  <span class="text-nowrap">{{ option.label }}</span>
                </span>
              </div>
            </div>
            <div class="form-block mb-3">
              <label for="content">留言内容</label>
              <div class="form-item">
                <VeeField v-model="messageForm.content" name="留言内容" rules="required|min:2">
                  <Editor height="calc(100vh - 360px)" v-model="messageForm.content" :mentions="mentionList"
                    :toolbar-container="toolbarOptions" />
                </VeeField>
                <Transition name="fade">
                  <VeeErrorMessage class="error-message" name="留言内容" key="content" />
                </Transition>
              </div>
            </div>
            <div class="w-full flex">
              <div class="w-[86px]" style="flex-shrink: 0"></div>
              <div class="flex-1 flex justify-end gap-2">
                <span>
                  <button type="reset" class="!px-1rem !min-h-30px" @click="modelValue = false"> 取消 </Button>
                </span>
                <span>
                  <Button class="!px-1rem !py-0 !min-h-30px" :loading="loading" type="submit"> 确认 </Button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </VeeForm>
    </Modal>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { MessageTypeEnum } from '~/enum';
import { useUserStore } from '~/store';
import type { MessageForm } from '~/types/form/message';
import { putUpdateMessage, postMessage } from '~/api';
import type { IMessage, MessageType } from '~/types/message';

const props = defineProps<{
  type?: string;
  message?: IMessage;
  typeOptions?: Array<MessageType>;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
}>()

const { $toast } = useNuxtApp()
const { user, mentionList } = storeToRefs(useUserStore());
const router = useRouter()
const toolbarOptions = [
  [
    'undo',
    'redo',
    'bold',
    'italic',
    'underline',
    'code-block',
    'emoji',
    { background: [] },
    { align: [] },
    { list: 'ordered' },
    { list: 'bullet' },
    ...[user.value ? 'image' : '']
  ],
]

const modelValue = defineModel<boolean>()
const loading = ref(false)

const originalMessage = () => ({
  type: props.type || MessageTypeEnum.GENERAL,
  content: '',
  user: user?.value,
  nickName: ''
})

const messageForm = ref<MessageForm>(originalMessage());

watch(modelValue, (val) => {
  if (val) {
    if (props.message) {
      Object.assign(messageForm.value, props.message);
    }
  } else {
    messageForm.value = originalMessage();
  }
})

function handleClose() {
  modelValue.value = false
}

const handleSubmit = () => {
  if (loading.value) return;
  loading.value = true;
  if (messageForm.value?.id) {
    putUpdateMessage(messageForm.value.id, messageForm.value)
      .then(() => {
        $toast.success('修改成功')
        modelValue.value = false;
        emit('success');
      })
      .catch(() => {
        loading.value = false;
      });
  } else {
    postMessage(messageForm.value)
      .then((res) => {
        $toast.success('留言成功')
        modelValue.value = false;
        router.push('/messages/detail/' + res.data.id)
      })
      .catch(() => {
        loading.value = false;
      });
  }
};
</script>

<style lang="scss" scoped></style>