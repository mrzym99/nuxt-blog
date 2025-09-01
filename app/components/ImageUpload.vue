<template>
  <div class="avatar-upload">
    <!-- 头像预览和上传区域 -->
    <div class="avatar-preview" :style="{ backgroundImage: `url(${previewImage || modelValue})` }"
      @click="triggerFileInput">
      <div v-if="isUploading" class="upload-mask">
        <div class="loading-spinner"></div>
      </div>
      <div v-else class="edit-overlay">
        <i class="i-carbon-camera text-white text-2xl"></i>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect" />

    <!-- 错误提示 -->
    <Transition name="fade">
      <div v-if="uploadError" class="error-message mt-2">
        {{ uploadError }}
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import FormData from 'form-data';
import { uploadImg } from '~/api';

defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const fileInput = ref<HTMLInputElement>();
const previewImage = ref<string>();
const isUploading = ref(false);
const uploadError = ref<string>();

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 处理文件选择
const handleFileSelect = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  // 验证文件类型和大小
  if (!file.type.startsWith('image/')) {
    uploadError.value = '请选择图片文件';
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    uploadError.value = '图片大小不能超过2MB';
    return;
  }

  try {
    isUploading.value = true;
    uploadError.value = '';

    // 生成预览图
    previewImage.value = URL.createObjectURL(file);

    // 调用上传API（需要实现上传接口）
    const formData = new FormData();
    formData.append('file', file);
    uploadImg(formData).then(res => {
      previewImage.value = '';
      emit('update:modelValue', res.data);
    });
  } catch (error) {
    uploadError.value = '上传失败，请稍后重试';
    console.error('Upload failed:', error);
  } finally {
    isUploading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.avatar-upload {
  @apply flex flex-col items-center;

  .avatar-preview {
    @apply w-[8rem] h-[8rem] rounded-full bg-gray-100 bg-cover bg-center cursor-pointer border-2 border-solid border-gray-300 relative overflow-hidden;

    .edit-overlay {
      @apply absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 transition-opacity;
    }

    .upload-mask {
      @apply absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center;
    }

    &:hover .edit-overlay {
      @apply opacity-100;
    }
  }

  .loading-spinner {
    @apply w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin;
  }

  .error-message {
    @apply text-red-500 text-sm;
  }
}
</style>
