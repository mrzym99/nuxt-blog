<template>
  <div class="relative z-2">
    <div class="user-center">
      <!-- User Center -->
      <div class="header mb-4">
        个人中心
      </div>
      <main class="flex-1 block relative">
        <Loading :loading="loading">
          <UserInfo :user-info="userInfo" />
        </Loading>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { getBlogUserInfo } from '~/api/config';
import type { IUser } from '~/types';
import { isLoggedIn } from '~/utils/auth';
import UserInfo from './modules/user-info.vue';


defineOptions({
  name: 'UserCenter',
});

const userInfo = ref<IUser>();
const route = useRoute();
const router = useRouter();
const id = route.params.id as unknown as number;
const loading = ref(true);

function initUserInfo() {
  getBlogUserInfo(id).then(res => {
    userInfo.value = res.data;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}

onMounted(() => {
  if (!isLoggedIn()) {
    router.push('/');
  }
  initUserInfo();
});
</script>

<style lang="scss" scoped>
.user-center {
  @include responsive(lt-lg) {
    display: block;
  }
}

.header {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  color: var(--primary-color);
  border-bottom: 1px solid var(--border-color);
}
</style>
