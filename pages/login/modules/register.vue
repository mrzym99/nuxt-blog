<template>
  <div class="register-form">
    <VeeForm @submit="handleLogin">
      <div class="form-group mb-2">
        <label class="mb-1" for="email">邮箱</label>
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
        <label class="mb-1" for="code">验证码</label>
        <div class="flex items-center">
          <VeeField
            class="!w-75%"
            v-model="loginForm.code"
            name="code"
            placeholder="请输入验证码"
            rules="required|code"
          />
          <Button
            class="flex-1"
            :loading="sendCodeLoading"
            :disabled="isCounting"
            @click="sendCode"
            >{{ isCounting ? `${count}s后重发` : '发送' }}</Button
          >
        </div>
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="code" />
        </Transition>
      </div>
      <div class="form-group mb-2">
        <label class="mb-1" for="username">用户名</label>
        <VeeField
          v-model="loginForm.username"
          name="username"
          placeholder="请输入自定义的用户名"
          rules="username"
        />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="username" />
        </Transition>
      </div>
      <div class="form-group mb-2">
        <label class="mb-1" for="password">密码</label>
        <VeeField
          v-model="loginForm.password"
          name="password"
          placeholder="请输入密码"
          rules="required|password"
        />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="password" />
        </Transition>
      </div>
      <div class="form-group mb-5">
        <label class="mb-1" for="confirmPassword">确认密码</label>
        <VeeField
          v-model="loginForm.confirmPassword"
          name="confirmPassword"
          placeholder="请输入密码"
          rules="required|confirmPassword:@password"
        />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="confirmPassword" />
        </Transition>
      </div>
      <Button :loading="loading" type="submit"> 登录 </Button>
    </VeeForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getEmailCaptcha, postRegister, type Register } from '~/api';
import Button from '~/components/Button.vue';
import useCountDown from '~/hooks/use-count-down';
import { useNuxtApp } from '#app';

const { $toast } = useNuxtApp();
const router = useRouter();
const loading = ref(false);
const sendCodeLoading = ref(false);

const loginForm = ref<Register>({
  email: '',
  code: '',
  username: '',
  password: '',
  confirmPassword: '',
});

const { count, start, isCounting } = useCountDown(60);

const sendCode = async () => {
  if (!loginForm.value.email) {
    return $toast.warning('请输入邮箱');
  }
  sendCodeLoading.value = true;
  getEmailCaptcha(loginForm.value.email)
    .then(() => {
      sendCodeLoading.value = false;
      start();
    })
    .catch(() => {
      sendCodeLoading.value = false;
    });
};

const handleLogin = () => {
  loading.value = true;
  postRegister(loginForm.value)
    .then(() => {
      loading.value = false;
      router.push({ path: '/login/pwd-login' });
      $toast.success('注册成功，快去登录吧');
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

.register-form {
  width: 100%;
  margin-bottom: 20px;
}
</style>
