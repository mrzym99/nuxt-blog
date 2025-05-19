<template>
  <div class="login-form">
    <VeeForm @submit="handleReset">
      <div class="block gap-[2rem] md:flex">
        <div class="form-group mb-2 flex justify-center">
          <VeeField v-model="loginForm.avatar" name="avatar">
            <ImageUpload v-model="loginForm.avatar" />
          </VeeField>
          <Transition name="fade">
            <VeeErrorMessage class="error-message" name="头像" key="avatar" />
          </Transition>
        </div>
        <div class="flex-1 mt-2rem md:mt-0">
          <div class="form-group mb-2">
            <label for="avatar">昵称</label>
            <VeeField
              v-model="loginForm.nickName"
              name="nickName"
              placeholder="请输入昵称"
              rules="required"
            />
            <Transition name="fade">
              <VeeErrorMessage class="error-message" name="昵称" key="nickName" />
            </Transition>
          </div>
          <div class="form-group mb-2">
            <label for="avatar">性别</label>
            <div class="mr-1rem flex items-center">
              <VeeField
                class="radio"
                v-model="loginForm.gender"
                name="性别"
                rules="required"
                type="radio"
                :value="1"
              />
              男
            </div>
            <div class="flex items-center">
              <VeeField
                class="radio"
                name="性别"
                v-model="loginForm.gender"
                rules="required"
                type="radio"
                :value="0"
              />
              女
            </div>

            <Transition name="fade">
              <VeeErrorMessage class="error-message" name="性别" key="gender" />
            </Transition>
          </div>
          <div class="form-group mb-2">
            <label for="avatar">生日</label>
            <VeeField
              v-model="loginForm.birthDate"
              type="date"
              name="生日"
              placeholder="请输入生日"
            />
            <Transition name="fade">
              <VeeErrorMessage class="error-message" name="生日" key="birthDate" />
            </Transition>
          </div>
          <div class="form-group mb-2">
            <label for="avatar">地址</label>
            <VeeField
              v-model="loginForm.address"
              name="地址"
              placeholder="请输入地址"
              as="textarea"
              rows="2"
            />
            <Transition name="fade">
              <VeeErrorMessage class="error-message" name="地址" key="address" />
            </Transition>
          </div>
          <div class="form-group mb-2">
            <label for="avatar">个人介绍</label>
            <VeeField
              v-model="loginForm.introduction"
              name="个人介绍"
              as="textarea"
              rows="2"
              placeholder="请输入个人介绍"
            />
            <Transition name="fade">
              <VeeErrorMessage class="error-message" name="个人介绍" key="introduction" />
            </Transition>
          </div>
          <div class="form-group mb-2">
            <label for="avatar">个性签名</label>
            <VeeField
              v-model="loginForm.signature"
              name="个性签名"
              as="textarea"
              rows="2"
              placeholder="请输入个性签名"
            />
            <Transition name="fade">
              <VeeErrorMessage class="error-message" name="个性签名" key="signature" />
            </Transition>
          </div>
          <div class="w-full flex">
            <div class="w-[96px]" style="flex-shrink: 0"></div>
            <Button :loading="loading" type="submit"> 确认 </Button>
          </div>
        </div>
      </div>
    </VeeForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { putUpdateProfile } from '~/api';
import Button from '~/components/Button.vue';
import { useNuxtApp } from '#app';
import type { Profile } from '~/types';
import ImageUpload from '~/components/ImageUpload.vue';

const { $toast } = useNuxtApp();
const loading = ref(false);

const props = defineProps<{
  profile?: Profile;
}>();

const emit = defineEmits(['success']);

const loginForm = ref<Profile>({
  id: 0,
  nickName: '',
  avatar: '',
  gender: 0,
  birthDate: undefined,
  address: '',
  introduction: '',
  signature: '',
  email: '',
});

const formateDate = (date?: Date) => {
  return date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
};

const handleReset = () => {
  if (loading.value) return;
  loading.value = true;
  putUpdateProfile(loginForm.value)
    .then(() => {
      $toast.success('修改成功');
      loading.value = false;
      emit('success');
    })
    .catch(() => {
      loading.value = false;
    });
};

watch(
  () => props.profile,
  val => {
    if (val) {
      Object.assign(loginForm.value, val);
      const birthDate = val.birthDate ? formateDate(val.birthDate) : formateDate();
      loginForm.value.birthDate = birthDate as any;
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;
@use '~/assets/styles/base.scss' as *;

.login-form {
  width: 100%;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  min-height: 30px;
}

label {
  position: relative;
  display: inline-block;
  width: 80px;
  text-align: right;
  margin-right: 16px;
  flex-shrink: 0;

  &::after {
    content: ':';
    position: absolute;
    right: -8px;
    top: 0;
  }
}

input {
  padding: 3px;
  min-height: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
  @include themed() {
    background-color: themed('bg');
  }
}

.radio {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}
</style>
