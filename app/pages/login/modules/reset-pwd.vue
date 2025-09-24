<template>
  <div class="login-form">
    <VeeForm @submit="handleReset">
      <div class="form-group mb-2">
        <VeeField v-model="loginForm.email" name="邮箱" type="email" placeholder="请输入QQ邮箱" rules="required|email" />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="邮箱" key="email" />
        </Transition>
      </div>
      <div class="form-group mb-2">
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
      <div class="form-group mb-2">
        <Password class="w-full" v-model="loginForm.password" name="密码" placeholder="请输入密码" rules="required|password" />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="密码" key="password" />
        </Transition>
      </div>
      <div class="form-group mb-2">
        <Password class="w-full" v-model="loginForm.confirmPassword" name="确认密码" placeholder="请输入确认密码"
          rules="required|confirmPassword:@密码" />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="确认密码" key="confirmPassword" />
        </Transition>
      </div>
      <Button :loading="loading" type="submit"> 确认 </Button>
    </VeeForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getEmailCaptcha, putResetPassword } from '~/api';
import Button from '~/components/Button.vue';
import type { ResetPwdForm } from '~/types/form';
import useCountDown from '~/hooks/useCountDown';

const { $toast } = useNuxtApp()
const router = useRouter();
const loading = ref(false);
const sendCodeLoading = ref(false);

const loginForm = ref<ResetPwdForm>({
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
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

const handleReset = () => {
  if (loading.value) return;
  loading.value = true;
  putResetPassword(loginForm.value)
    .then(() => {
      $toast.promise(() => new Promise((resolve) => setTimeout(resolve, 1000)), {
        loading: '重置成功',
        success: () => {
          router.push('/login/pwd-login');
          return '请重新登录'
        },
      })
    })
    .catch(() => {
      loading.value = false;
    });
};
</script>

<style lang="scss" scoped>
.login-form {
  width: 100%;
  margin-bottom: 20px;
}
</style>
