<template>
  <div class="mx-auto">
    <section class="h-6rem flex flex-col items-center justify-center blog-bg">
      <h1 class="leading-tight font-bold mb-6">User Center</h1>
    </section>
    <div class="article-container mx-auto lt-sm:py-8">
      <div class="user-center">
        <div></div>
        <!-- User Center -->
        <main class="flex-1 block relative">
          <div class="absolute top-1 right-2">
            <span class="cursor-pointer text-gradient" @click="isEdit = !isEdit">{{
              isEdit ? '取消编辑' : '编辑'
            }}</span>
          </div>
          <UserInfo v-if="!isEdit" :user-info="userInfo" />
          <div v-else class="w-full">
            <div class="tab mb-1rem">
              <span
                @click="toggleTab('info')"
                class="tab-item"
                :class="{ active: currentTab === 'info' }"
                >修改个人信息</span
              >
              <span
                @click="toggleTab('pwd')"
                class="tab-item"
                :class="{ active: currentTab === 'pwd' }"
                >修改密码</span
              >
            </div>
            <div class="grid place-items-center">
              <UpdateProfile
                :profile="userInfo?.profile"
                v-if="currentTab === 'info'"
                @success="updateProfileSuccess"
              />
              <UpdatePwd v-if="currentTab === 'pwd'" />
            </div>
          </div>
        </main>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { getBlogUserInfo } from '~/api/config';
import type { IUser } from '~/types';
import UserInfo from './modules/user-info.vue';
import UpdatePwd from './modules/update-pwd.vue';
import UpdateProfile from './modules/update-profile.vue';

defineOptions({
  name: 'UserCenter',
});

const userInfo = ref<IUser>();

const route = useRoute();
const id = route.params.id as unknown as number;
const currentTab = ref('info');
const isEdit = ref(false);

const toggleTab = (tab: string) => {
  currentTab.value = tab;
};

function initUserInfo() {
  getBlogUserInfo(id).then(res => {
    userInfo.value = res.data;
  });
}

function updateProfileSuccess() {
  isEdit.value = false;
  initUserInfo();
}

onMounted(() => {
  initUserInfo();
});
</script>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;
@use '~/assets/styles/base.scss' as *;

.user-center {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  gap: 1rem;

  @include responsive(lg) {
    display: block;
  }
}
</style>
