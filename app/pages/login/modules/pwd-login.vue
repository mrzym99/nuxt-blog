<template>
  <div class="login-form">
    <VeeForm @submit="handleLogin">
      <div class="form-group mb-2">
        <label class="mb-1" for="用户名">用户名</label>
        <VeeField v-model="loginForm.username" name="用户名" type="email" placeholder="请输入用户名" rules="required|username" />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="用户名" key="username" />
        </Transition>
      </div>
      <div class="form-group mb-5">
        <label class="mb-1" for="密码">密码</label>
        <VeeField v-model="loginForm.password" name="密码" type="password" placeholder="请输入密码"
          rules="required|password" />
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

const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);
const { $toast } = useNuxtApp()

const loginForm = ref<PwdLogin>({
  username: '',
  password: '',
  code: '',
  captchaId: '',
});

const handleLogin = () => {
  if (loading.value) return;
  loading.value = true;
  userStore
    .pwdLogin(loginForm.value)
    .then(() => {
      loading.value = false;
      $toast.promise(() => new Promise((resolve) => setTimeout(resolve, 1500)), {
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
};
</script>

<style lang="scss" scoped>
.login-form {
  width: 100%;
  margin-bottom: 20px;
}
</style>
