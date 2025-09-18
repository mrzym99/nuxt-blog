<template>
  <div class="relative z-2">
    <div class="user-center">
      <!-- User Center -->
      <main class="flex-1 block relative">
        <div class="w-full">
          <Tab class="mb-4" v-model="currentTab" :options="tabOptions" @change="toggleTab" />
          <div class="min-h-60vh">
            <UpdateProfile :profile="userInfo?.profile" v-if="currentTab === 'info'" @success="updateProfileSuccess" />
            <UpdatePwd v-if="currentTab === 'pwd'" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
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

const route = useRoute();
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
  getBlogUserInfo(user.value?.id).then(res => {
    userInfo.value = res.data;
  });
}

function updateProfileSuccess() {
  isEdit.value = false;
  initUserInfo();
}

watch(
  () => user.value,
  () => {
    if (!user.value) {
      router.push('/');
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

onMounted(() => {
  initUserInfo();
});
</script>

<style lang="scss" scoped>
.user-center {
  @include responsive(lt-lg) {
    display: block;
  }
}
</style>
