<template>
  <div class="mx-auto relative z-2">
    <PageHeader title="User Center" />
    <div class="container mx-auto py-8">
      <div class="user-center">
        <!-- User Center -->
        <main class="flex-1 block relative">
          <div v-if="showOperation" class="absolute top-1 right-2">
            <span class="cursor-pointer text-gradient" @click="isEdit = !isEdit">{{
              isEdit ? '取消编辑' : '编辑'
            }}</span>
          </div>
          <UserInfo v-if="!isEdit" :user-info="userInfo" />
          <div v-else class="w-full">
            <Tab class="mb-4" v-model="currentTab" :options="tabOptions" @change="toggleTab" />
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
      </div>
    </div>
  </div>
  <ClientOnly>
    <Dots />
  </ClientOnly>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { getBlogUserInfo } from '~/api/config';
import type { IUser } from '~/types';
import UserInfo from './modules/user-info.vue';
import UpdatePwd from './modules/update-pwd.vue';
import UpdateProfile from './modules/update-profile.vue';
import { useUserStore } from '~/store';
import { storeToRefs } from 'pinia';
import Tab from '~/components/Tab.vue';
import PageHeader from '~/components/PageHeader.vue';
import Dots from '~/components/Dots.vue';

defineOptions({
  name: 'UserCenter',
});

const userInfo = ref<IUser>();
const { user } = storeToRefs(useUserStore());

const route = useRoute();
const router = useRouter();
const id = route.params.id as unknown as number;
const currentTab = ref('info');
const isEdit = ref(false);
const tabOptions = [
  { label: '修改个人信息', value: 'info' },
  { label: '修改密码', value: 'pwd' },
];

const showOperation = computed(() => {
  return user.value && Number(user.value.id) === Number(id);
});

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
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;
@use '~/assets/styles/base.scss' as *;

.user-center {
  @include responsive(lg) {
    display: block;
  }
}
</style>
