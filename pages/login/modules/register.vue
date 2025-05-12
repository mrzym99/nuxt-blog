<template>
  <div class="register-container">
    <h1>注册</h1>
    <div class="register-form">
      <div class="form-group mb-2">
        <label for="email">邮箱</label>
        <input type="email" id="email" v-model="email" placeholder="请输入邮箱" />
      </div>
      <div class="form-group mb-8">
        <label for="code">验证码</label>
        <div class="flex items-center">
          <input class="!w-[70%]" type="text" id="code" v-model="code" placeholder="请输入验证码" />
          <button class="flex-1" @click="sendCode">发送</button>
        </div>
      </div>
      <button @click="handleRegister">注册</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const code = ref('');

const sendCode = () => {
  // 预留接口：发送验证码
  console.log('发送验证码', { email: email.value });
};

const handleRegister = () => {
  // 预留接口：邮箱验证码注册
  console.log('邮箱验证码注册', { email: email.value, code: code.value });
};
</script>

<style scoped lang="scss">
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;
@use '~/assets/styles/base.scss' as *;

.register-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.register-form {
  margin-bottom: 20px;
}
</style>
