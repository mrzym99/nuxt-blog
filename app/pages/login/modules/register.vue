<template>
  <div class="register-form">
    <VeeForm @submit="handleLogin">
      <div class="form-group mb-2">
        <VeeField
          v-model="loginForm.email"
          name="邮箱"
          type="email"
          placeholder="请输入QQ邮箱"
          rules="required|email"
        />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="邮箱" key="email" />
        </Transition>
      </div>
      <div class="form-group mb-2">
        <div class="flex items-center">
          <VeeField
            class="!w-75% code-input"
            v-model="loginForm.code"
            name="验证码"
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
          <VeeErrorMessage class="error-message" name="验证码" key="code" />
        </Transition>
      </div>
      <div class="form-group mb-2">
        <VeeField
          v-model="loginForm.username"
          name="用户名"
          placeholder="请输入自定义的用户名"
          rules="username"
        />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="用户名" key="username" />
        </Transition>
      </div>
      <div class="form-group mb-2">
        <VeeField
          v-model="loginForm.password"
          name="密码"
          placeholder="请输入密码"
          rules="required|password"
        />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="密码" key="password" />
        </Transition>
      </div>
      <div class="form-group mb-2">
        <VeeField
          v-model="loginForm.confirmPassword"
          name="确认密码"
          placeholder="请输入确认密码"
          rules="required|confirmPassword:@密码"
        />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="确认密码" key="confirmPassword" />
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
import useCountDown from '~/hooks/useCountDown';

// const toast = useToast();
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
    // return toast.warning({ message: '请输入QQ邮箱' });
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
  if (loading.value) return;
  loading.value = true;
  postRegister(loginForm.value)
    .then(() => {
      loading.value = false;
      // toast.success({
      //   message: '注册成功，快去登录吧',
      //   timeout: 200,
      //   onClosed: () => {
      //     router.push({ path: '/login/pwd-login' });
      //   },
      // });
    })
    .catch(() => {
      loading.value = false;
    });
};
</script>

<style lang="scss" scoped>
@use '~/assets/styles/global.scss' as *;
@use '~/assets/styles/base.scss' as *;

.register-form {
  width: 100%;
  margin-bottom: 20px;
}
</style>
