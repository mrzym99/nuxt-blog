<template>
  <div class="relative z-2">
    <div class="py-8">
      <div class="user-center">
        <!-- User Center -->
        <main class="flex-1 block relative">
          <UserInfo :user-info="userInfo" />
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
import { useUserStore } from '~/store';
import { storeToRefs } from 'pinia';
import { isLoggedIn } from '~/utils/auth';
import UserInfo from './modules/user-info.vue';
import Dots from '~/components/Dots.vue';


defineOptions({
  name: 'UserCenter',
});

const userInfo = ref<IUser>();
const { user } = storeToRefs(useUserStore());

const route = useRoute();
const router = useRouter();
const id = route.params.id as unknown as number;

function initUserInfo() {
  getBlogUserInfo(id).then(res => {
    userInfo.value = res.data;
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
</style>
