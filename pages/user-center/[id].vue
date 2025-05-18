<template>
  <div class="mx-auto">
    <section class="h-6rem flex flex-col items-center justify-center blog-bg">
      <h1 class="leading-tight font-bold mb-6">User Center</h1>
    </section>
    <div class="article-container mx-auto lt-sm:py-8">
      <div class="user-center">
        <div></div>
        <!-- User Center -->
        <main class="flex-1 block gap-[1rem] md:flex">
          <div class="form w-50%">
            <UserInfo v-if="userInfo" :user-info="userInfo" />
          </div>
          <div class="mt-2rem md:mt-5rem flex-1">
            <div class="tab">
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
            <UpdatePwd v-if="currentTab === 'pwd'" />
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

defineOptions({
  name: 'UserCenter',
});

const userInfo = ref<IUser>();

const route = useRoute();
const id = route.params.id as unknown as number;
const currentTab = ref('info');

const toggleTab = (tab: string) => {
  currentTab.value = tab;
};

function initUserInfo() {
  getBlogUserInfo(id).then(res => {
    userInfo.value = res.data;
  });
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
