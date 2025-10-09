<template>
  <div class="relative z-2">
    <div class="user-center">
      <!-- User Center -->
      <main class="flex-1 block relative">
        <div class="w-full">
          <Tab class="mb-4" v-model="currentTab" :options="tabOptions" @change="toggleTab" />
          <Loading :loading="loading">
            <div class="min-h-60vh">
              <transition-group name="fade-in">
                <UpdateProfile key="info" :profile="userInfo?.profile" v-if="currentTab === 'info'"
                  @success="updateProfileSuccess" />
                <UpdatePwd key="pwd" v-if="currentTab === 'pwd'" />
              </transition-group>
            </div>
          </Loading>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getBlogUserInfo } from '~/api/config';
import type { IUser } from '~/types';
import UpdatePwd from './modules/update-pwd.vue';
import UpdateProfile from './modules/update-profile.vue';
import { useUserStore } from '~/store';
import { storeToRefs } from 'pinia';
import Tab from '~/components/Tab.vue';

defineOptions({
  name: 'UserCenter',
});

const userInfo = ref<IUser>();
const { user } = storeToRefs(useUserStore());
const loading = ref(true);

const router = useRouter();
const currentTab = ref('info');
const isEdit = ref(false);
const tabOptions = [
  { label: '修改个人信息', value: 'info' },
  { label: '修改密码', value: 'pwd' },
];

const toggleTab = (tab: string) => {
  currentTab.value = tab;
};

function initUserInfo() {
  if (!user.value?.id) return
  getBlogUserInfo(user.value?.id).then(res => {
    userInfo.value = res.data;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}

function updateProfileSuccess() {
  isEdit.value = false;
  initUserInfo();
}

watch(
  () => user.value,
  () => {
    initUserInfo();
  },
  {
    immediate: true,
    deep: true,
  }
);

onMounted(() => {
  if (!isLoggedIn()) {
    router.push('/');
  }
});
</script>

<style lang="scss" scoped>
.user-center {
  @include responsive(lt-lg) {
    display: block;
  }
}
</style>
