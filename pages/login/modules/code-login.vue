<template>
  <div class="login-form">
    <VeeForm @submit="handleLogin">
      <div class="form-group mb-2">
        <VeeField
          v-model="loginForm.email"
          name="email"
          type="email"
          placeholder="请输入邮箱"
          rules="required|email"
        />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="email" key="email" />
        </Transition>
      </div>
      <div class="form-group mb-2">
        <div class="flex items-center">
          <VeeField
            class="!w-75% code-input"
            v-model="loginForm.code"
            name="code"
            placeholder="请输入验证码"
            rules="required|code"
          />
          <Button
            class="flex-1 code-button"
            :loading="sendCodeLoading"
            :disabled="isCounting"
            @click="sendCode"
            >{{ isCounting ? `${count}s` : '发送' }}</Button
          >
        </div>
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="code" />
        </Transition>
      </div>
      <Button :loading="loading" type="submit"> 登录 </Button>
    </VeeForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getEmailCaptcha, type CodeLogin } from '~/api';
import { useUserStore } from '~/store';
import Button from '~/components/Button.vue';
import useCountDown from '~/hooks/use-count-down';
import { useNuxtApp } from '#app';

const { $toast } = useNuxtApp();
const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);
const sendCodeLoading = ref(false);

const loginForm = ref<CodeLogin>({
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
      $toast.success('登录成功', {
        autoClose: 300,
        onClose() {
          router.push('/');
        },
      });
    })
    .catch(() => {
      loading.value = false;
    });
};
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;
@use '~/assets/styles/base.scss' as *;

.login-form {
  width: 100%;
  margin-bottom: 20px;
}
</style>
