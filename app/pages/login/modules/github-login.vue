<template>
  <div class="register-form">
    <VeeForm v-if="needRegister" @submit="handleLogin">
      <div class="tip mb-2">请完善以下信息</div>
      <div class="form-group mb-2">
        <VeeField v-model="loginForm.username" name="用户名" type="email" placeholder="请输入用户名" rules="required|username" />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="用户名" key="username" />
        </Transition>
      </div>
      <div class="form-group mb-2">
        <VeeField v-model="loginForm.password" name="密码" placeholder="请输入密码" rules="required|password" />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="密码" key="password" />
        </Transition>
      </div>
      <div class="form-group mb-2">
        <VeeField v-model="loginForm.confirmPassword" name="确认密码" placeholder="请输入密码"
          rules="required|confirmPassword:@密码" />
        <Transition name="fade">
          <VeeErrorMessage class="error-message" name="确认密码" key="confirmPassword" />
        </Transition>
      </div>
      <Button :loading="loading" type="submit"> 注册 </Button>
    </VeeForm>
    <div v-else class="flex items-center justify-center p-4 min-h-[200px]">
      登录中 请稍候...
      <Icon name="svg-spinners:90-ring-with-bg" size="2rem" class="ml-2"></Icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getIsRegister, getThirdTypeAntToken, type ThirdRegister } from '~/api';
import Button from '~/components/Button.vue';
import { useUserStore } from '~/store';

const { $toast } = useNuxtApp()
const router = useRouter();
const loading = ref(false);

const loginForm = ref<ThirdRegister>({
  type: 'github',
  token_type: '',
  access_token: '',
  username: '',
  password: '',
  confirmPassword: '',
  from: 'github',
  uniqueId: '',
  avatar: '',
  address: '',
  nickName: '',
});

const code = ref('');
const needRegister = ref(false);

function getCode() {
  const route = useRoute();
  if (route.query.code) {
    code.value = route.query.code as string;
  } else {
    $toast.warning('获取三方登录授权码失败');
  }
}

function thirdLogin() {
  getThirdTypeAntToken({
    type: 'github',
    code: code.value,
  })
    .then(res => {
      const { token_type, access_token } = res.data;
      loginForm.value.token_type = token_type;
      loginForm.value.access_token = access_token;
      getIsRegister(loginForm.value).then(res => {
        const { userInfo, githubUserInfo } = res.data as any;
        if (userInfo) {
          loginForm.value.uniqueId = userInfo.uniqueId;
          handleLogin();
          // 登录
        } else {
          loginForm.value.username = githubUserInfo.name;
          loginForm.value.uniqueId = githubUserInfo.id;
          loginForm.value.avatar = githubUserInfo.avatar_url;
          loginForm.value.address = githubUserInfo.location;
          loginForm.value.nickName = githubUserInfo.name;
          needRegister.value = true;
        }
      });
    })
    .catch(() => {
      $toast.error('登录授权失效，请重新登录')
      router.back();
    })
}

const handleLogin = () => {
  if (loading.value) return;
  loading.value = true;
  useUserStore()
    .thirdLogin(loginForm.value)
    .then(() => {
      loading.value = false;
      $toast.promise(() => new Promise((resolve) => setTimeout(resolve, 1000)), {
        loading: '登录成功，即将返回',
        success: () => {
          router.back();
          return '欢迎回来，' + useUserStore().user?.nickName
        },
      })
    })
    .catch(() => {
      loading.value = false;
    });
};

onMounted(() => {
  getCode();
  thirdLogin();
});
</script>

<style lang="scss" scoped>
.register-form {
  width: 100%;
  margin-bottom: 20px;
}
</style>
