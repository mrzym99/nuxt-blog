<template>
  <div class="login">
    <div class="login-card">
      <div class="login-header">
        <NuxtLink to="/">
          <h3 class="m-0">M</h3>
        </NuxtLink>
        <ThemeSwitch />
      </div>
      <div class="login-container w-full m-1rem p-1rem">
        <div class="w-full flex justify-between">
          <h2 class="login-title">{{ titleMap[type] }}</h2>
          <span></span>
        </div>
        <Transition name="fade">
          <component :is="componentId" />
        </Transition>
        <div class="link-container" v-if="showLoginType">
          <NuxtLink v-if="type !== 'pwd-login'" class="login-link" to="/login/pwd-login" replace>密码登录</NuxtLink>
          <NuxtLink v-if="type !== 'code-login'" class="login-link" to="/login/code-login" replace>验证码</NuxtLink>
          <NuxtLink v-if="type !== 'github-login'" class="login-link" @click="thirdLogin(ThirdLoginTypeEnum.GITHUB)"
            replace>GitHub
          </NuxtLink>
        </div>
        <div class="bottom-link">
          <div class="flex justify-between items-center" v-if="showBottomLink">
            <div>
              <NuxtLink v-if="!['register', 'reset-pwd', 'code-login'].includes(type)" class="text-gradient"
                to="/login/reset-pwd" replace> 忘记密码？
              </NuxtLink>
            </div>
            <div v-if="type === 'register' || type === 'reset-pwd'">
              {{ type === 'register' ? '已有账号？' : '想起来了？' }}
              <NuxtLink class="text-gradient" to="/login/pwd-login" replace> 去登录 </NuxtLink>
            </div>
            <div v-else>
              没有账号？
              <NuxtLink class="text-gradient" to="/login/register" replace> 去注册 </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ClientOnly>
    <Dots />
  </ClientOnly>
</template>

<script setup lang="ts">
import { type Component, onBeforeMount } from 'vue';
import PwdLogin from './modules/pwd-login.vue';
import Register from './modules/register.vue';
import CodeLogin from './modules/code-login.vue';
import GithubLogin from './modules/github-login.vue';
import { getThirdLoginUrl } from '~/api';
import ResetPwd from './modules/reset-pwd.vue';
import Dots from '~/components/Dots.vue';
import ThemeSwitch from '~/components/ThemeSwitch.vue';
import { isLoggedIn } from '~/utils/auth';
import { LoginTypeEnum, ThirdLoginTypeEnum } from '~/enum';

definePageMeta({
  layout: 'blank',
});

const route = useRoute();
const router = useRouter();

const loginMap: Record<LoginTypeEnum, Component> = {
  [LoginTypeEnum.PWD_LOGIN]: PwdLogin,
  [LoginTypeEnum.CODE_LOGIN]: CodeLogin,
  [LoginTypeEnum.GITHUB_LOGIN]: GithubLogin,
  [LoginTypeEnum.REGISTER]: Register,
  [LoginTypeEnum.RESET_PWD]: ResetPwd,
};

const titleMap: Record<LoginTypeEnum, string> = {
  [LoginTypeEnum.PWD_LOGIN]: '登录',
  [LoginTypeEnum.CODE_LOGIN]: '验证码登录',
  [LoginTypeEnum.GITHUB_LOGIN]: 'GitHub登录',
  [LoginTypeEnum.REGISTER]: '注册',
  [LoginTypeEnum.RESET_PWD]: '重置密码',
};

const type = computed(() => route.params.type as LoginTypeEnum);

const showLoginType = computed(() => {
  return ['pwd-login', 'code-login', 'github-login'].includes(type.value);
});

const showBottomLink = computed(() => {
  return ['pwd-login', 'code-login', 'register', 'reset-pwd'].includes(type.value);
});

const componentId = computed(() => {
  return loginMap[type.value];
});

const thirdLogin = async (type: ThirdLoginTypeEnum) => {
  const res = await getThirdLoginUrl(type);
  if (window) window.location.href = res.data;
};

onBeforeMount(() => {
  if (isLoggedIn()) {
    router.push('/');
  }
});
</script>

<style scoped lang="scss">
.login {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
}

.login-card {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 800px;
  width: 24rem;
  min-height: 72vh;
  box-shadow: 0px 20px 80px 0px rgba(0, 0, 0, 0.3);
  z-index: 2;

  @include responsive(lt-sm) {
    width: 100%;
    height: 100vh;
  }

  @include responsive(lt-md) {
    width: 100%;
    height: 100vh;
  }
}

.login-header {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 3;
}

.login-container {
  z-index: 2;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;

  @include responsive(lt-sm) {
    height: 100%;
  }

  @include responsive(lt-md) {
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
    color: var(--primary-color);
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
  font-weight: 800;
  letter-spacing: 1px;
  border: 1px solid var(--text-color);
  color: var(--text-color);
  border-radius: 9999px;

  @include hover-effect {
    border-color: transparent;
    background-color: var(--primary-color);
    color: var(--white-color);
  }
}

.bottom-link {
  width: 100%;
}
</style>
