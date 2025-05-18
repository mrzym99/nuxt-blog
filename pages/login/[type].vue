<template>
  <div class="login">
    <div class="login-card">
      <div class="login-bg w-full h-full">
        <img :src="loginBg" alt="" />
      </div>
      <div class="login-container w-full p-2rem">
        <div class="w-full flex justify-between">
          <h1 class="login-title">{{ titleMap[type] }}</h1>
          <Icon class="back" name="ph:arrow-u-up-left-light" @click="back"></Icon>
        </div>
        <Transition name="fade">
          <component :is="componentId" />
        </Transition>
        <div class="link-container" v-if="type === 'pwd-login'">
          <NuxtLink class="login-link" to="/login/code-login">验证码</NuxtLink>
          <NuxtLink class="login-link" @click="thirdLogin('github')">GitHub</NuxtLink>
        </div>
        <div class="register-link">
          <div
            class="flex justify-between items-center"
            v-if="['pwd-login', 'register'].includes(type)"
          >
            <NuxtLink class="text-gradient underline" to="/login/reset-pwd"> 忘记密码？ </NuxtLink>
            <div v-if="type === 'register'">
              已有账号？
              <NuxtLink class="text-gradient underline" to="/login/pwd-login"> 去登录 </NuxtLink>
            </div>
            <div v-else>
              没有账号？
              <NuxtLink class="text-gradient underline" to="/login/register"> 去注册 </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Component, onBeforeMount } from 'vue';
import PwdLogin from './modules/pwd-login.vue';
import Register from './modules/register.vue';
import loginBg from '~/assets/images/login-bg.jpeg';
import { getToken } from '~/utils/auth';
import CodeLogin from './modules/code-login.vue';
import GithubLogin from './modules/github-login.vue';
import { getThirdLoginUrl } from '~/api';
import ResetPwd from './modules/reset-pwd.vue';

const route = useRoute();
const router = useRouter();

type loginType = 'pwd-login' | 'code-login' | 'github-login' | 'register' | 'reset-pwd';

const loginMap: Record<loginType, Component> = {
  'pwd-login': PwdLogin,
  'code-login': CodeLogin,
  'github-login': GithubLogin,
  register: Register,
  'reset-pwd': ResetPwd,
};

const titleMap: Record<loginType, string> = {
  'pwd-login': '登录',
  'code-login': '验证码登录',
  'github-login': 'GitHub登录',
  register: '注册',
  'reset-pwd': '重置密码',
};

const type = computed(() => route.params.type as loginType);

const componentId = computed(() => {
  return loginMap[type.value];
});

const thirdLogin = async (type: string) => {
  const res = await getThirdLoginUrl(type);
  if (window) window.location.href = res.data;
};

const back = () => {
  router.back();
};

onBeforeMount(() => {
  if (getToken()) {
    router.push('/');
  }
});
</script>

<style scoped lang="scss">
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;

.login {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
}

.login-card {
  max-width: 800px;
  min-height: 80vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-shadow: 0px 20px 80px 0px rgba(0, 0, 0, 0.3);
  background: themed('bg');

  @include responsive(md) {
    width: 100%;
    height: 100vh;
    display: block;
  }
}

.login-bg {
  position: relative;
  @include responsive(md) {
    display: none;
  }
  img {
    width: 100%;
    height: 100%;
    overflow: hidden;
    object-fit: cover;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
  }
}

.login-container {
  z-index: 2;
  max-width: 460px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;

  @include themed() {
    background: themed('bg');
  }

  @include responsive(md) {
    height: 100%;
  }

  .login-title {
    width: 100%;
    margin: 0 0 20px 0 !important;
  }
}

.back {
  font-size: 1.5rem;
  cursor: pointer;

  @include hover-effect {
    color: themed('primary');
  }
}

.link-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0 20px 0;
  gap: 0.5rem;
}

.login-link {
  text-align: center;
  cursor: pointer;
  padding: 0.3rem 0.8rem;
  font-size: 0.875rem;
  font-weight: 800;
  letter-spacing: 1px;
  border: 1px solid themed('text');
  color: themed('text');
  border-radius: 9999px;

  @include hover-effect {
    border-color: transparent;
    background-color: themed('primary');
    color: white;
  }
}

.register-link {
  width: 100%;
}
</style>
