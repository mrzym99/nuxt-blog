<template>
  <div class="login-form">
    <VeeForm @submit="handleReset">
      <div class="block gap-[2rem] md:flex">
        <div class="flex-1 max-w-480px mt-2rem md:mt-0">
          <div class="form-group mb-2">
            <label for="oldPassword">旧密码</label>
            <div class="form-item">
              <Password class="w-full" v-model="loginForm.oldPassword" name="旧密码" placeholder="请输入旧密码"
                rules="required|password" />
              <Transition name="fade">
                <VeeErrorMessage class="error-message" name="旧密码" key="oldPassword" />
              </Transition>
            </div>
          </div>
          <div class="form-group mb-2">
            <label for="newPassword">新密码</label>
            <div class="form-item">
              <Password class="w-full" v-model="loginForm.newPassword" name="新密码" placeholder="请输入新密码"
                rules="required|newPassword:@旧密码" />
              <Transition name="fade">
                <VeeErrorMessage class="error-message" name="新密码" key="newPassword" />
              </Transition>
            </div>
          </div>
          <div class="form-group mb-2">
            <label for="confirmPassword">确认密码</label>
            <div class="form-item">
              <Password class="w-full" v-model="loginForm.confirmPassword" name="确认密码" placeholder="请输入确认密码"
                rules="required|userConfirmPassword:@新密码" />
              <Transition name="fade">
                <VeeErrorMessage class="error-message" name="确认密码" key="confirmPassword" />
              </Transition>
            </div>
          </div>
          <div class="w-full flex">
            <div class="w-[86px]" style="flex-shrink: 0"></div>
            <Button :loading="loading" type="submit"> 确认 </Button>
          </div>
        </div>
      </div>
    </VeeForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { putUserResetPassword } from '~/api';
import Button from '~/components/Button.vue';
import { useNuxtApp } from '#app';
import { useUserStore } from '~/store';
import Password from '~/components/Password.vue';
import { storeToRefs } from 'pinia';
import type { UserResetPwdForm } from '~/types/form';

const { user } = storeToRefs(useUserStore());
const { $toast } = useNuxtApp()
const router = useRouter();
const loading = ref(false);

const loginForm = ref<UserResetPwdForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const handleReset = () => {
  if (loading.value) return;
  loading.value = true;
  putUserResetPassword(loginForm.value)
    .then(() => {
      $toast.success('修改成功，请重新登录')
      useUserStore().logout();
      router.push('/login/pwd-login');
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

  .form-group {
    display: flex;
    min-height: 30px;

    .form-item {
      flex: 1;
    }

    label {
      position: relative;
      display: inline-block;
      width: 70px;
      text-align: right;
      margin-right: 16px;
      flex-shrink: 0;

      &::after {
        content: ':';
        position: absolute;
        right: -8px;
        top: 0;
      }
    }

    input {
      padding: 3px;
      min-height: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
      transition: border-color $duration;
      background-color: var(--bg-color);
    }
  }
}
</style>
