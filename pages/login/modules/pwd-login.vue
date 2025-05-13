<template>
  <div class="login-form">
    <VeeForm @submit="handleLogin">
      <div class="form-group mb-2">
        <VeeField
          v-model="loginForm.username"
          name="用户名"
          type="email"
          placeholder="请输入用户名"
          rules="required|username"
        />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="用户名" key="username" />
        </Transition>
      </div>
      <div class="form-group mb-2">
        <VeeField
          v-model="loginForm.password"
          name="密码"
          type="password"
          placeholder="请输入密码"
          rules="required|password"
        />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="密码" key="password" />
        </Transition>
      </div>
      <Button :loading="loading" type="submit"> 登录 </Button>
    </VeeForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { PwdLogin } from '~/api';
import { useUserStore } from '~/store';
import Button from '~/components/Button.vue';
import { useNuxtApp } from '#app';

const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);
const { $toast } = useNuxtApp();

const loginForm = ref<PwdLogin>({
  username: 'admin',
  password: '123456',
  code: '',
  captchaId: '',
});

const handleLogin = () => {
  loading.value = true;
  // userStore
  //   .pwdLogin(loginForm.value)
  //   .then(() => {
  //     loading.value = false;
  //     router.back();
  //     $toast.success('登录成功');
  //   })
  //   .catch(() => {
  //     loading.value = false;
  //   });
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
