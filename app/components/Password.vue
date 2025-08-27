<template>
  <div class="relative">
    <Transition name="fade">
      <VeeField
        v-bind="$attrs"
        v-model="model"
        :type="showPassword ? 'text' : 'password'"
        :name="name"
        :placeholder="placeholder"
        :rules="rules"
      />
    </Transition>
    <span class="absolute right-2 top-3 cursor-pointer text-gray-400">
      <Transition>
        <Icon v-if="showPassword" name="ph:eye-slash" @click="showPassword = false"></Icon>
        <Icon v-else name="ph:eye" @click="showPassword = true"></Icon>
      </Transition>
    </span>
  </div>
</template>

<script lang="ts" setup>
const model = defineModel();
defineProps({
  name: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请输入',
  },
  rules: {
    type: String,
    default: '',
  },
});
const showPassword = ref(false);
</script>

<style lang="scss" scoped>

</style>
