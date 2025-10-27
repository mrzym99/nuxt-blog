<template>
  <div class="login-form">
    <VeeForm @submit="handleLogin">
      <div class="form-inline mb-2">
        <VeeField v-model="loginForm.email" name="邮箱" type="email" placeholder="请输入QQ邮箱" rules="required|email" />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="邮箱" key="email" />
        </Transition>
      </div>
      <div class="form-inline mb-2">
        <div class="flex items-center">
          <VeeField class="!w-75% code-input" v-model="loginForm.code" name="验证码" placeholder="请输入验证码"
            rules="required|code" />
          <Button class="flex-1 code-button" :loading="sendCodeLoading" :disabled="isCounting" @click="sendCode">{{
            isCounting ? `${count}s` : '发送' }}</Button>
        </div>
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="验证码" key="code" />
        </Transition>
      </div>
      <Button :loading="loading" type="submit"> 登录 </Button>
    </VeeForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getEmailCaptcha } from '~/api';
import { useUserStore } from '~/store';
import Button from '~/components/Button.vue';
import useCountDown from '~/hooks/useCountDown';
import type { CodeLoginForm } from '~/types/form';

const { $toast } = useNuxtApp()
const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);
const sendCodeLoading = ref(false);

const loginForm = ref<CodeLoginForm>({
  email: '',
  code: '',
});

const { count, start, isCounting } = useCountDown(60);

const sendCode = async () => {
  sendCodeLoading.value = true;
  start();
  getEmailCaptcha(loginForm.value.email)
    .then(() => {
      sendCodeLoading.value = false;
      start();
      $toast.success('发送成功，请注意查收邮件');
    })
    .catch(() => {
      sendCodeLoading.value = false;
    });
};

const handleLogin = () => {
  if (loading.value) return;
  loading.value = true;
  userStore
    .codeLogin(loginForm.value)
    .then(() => {
      loading.value = false;
      $toast.promise(() => new Promise((resolve) => setTimeout(resolve, 1000)), {
        loading: '登录成功，即将返回',
        success: () => {
          router.back();
          return '欢迎回来，' + userStore.user?.nickName
        },
      })
    })
    .catch(() => {
      loading.value = false;
    });
}
</script>

<style lang="scss" scoped></style>
