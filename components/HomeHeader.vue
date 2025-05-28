<template>
  <header ref="headerRef" class="bg-gray-100 flex flex-col items-center justify-center blog-bg">
    <h1 class="text-6xl text-center tracking-[3px] font-bold mb-6 lt-md:text-5xl">Xiao Zhang</h1>
    <p class="text-2xl lt-md:text-xl tracking-[2px] text-center mx-auto px-4">
      「 东边日出西边雨，道是无晴却有晴 」
    </p>
    <div><img :src="bg" /></div>
  </header>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import bg from '~/assets/images/bg.jpg';

defineProps({
  title: {
    type: String,
    default: '',
  },
});

const headerRef = ref<HTMLElement | null>(null);
const startX = ref(0);

const handleMouseEnter = (e: MouseEvent) => {
  startX.value = e.clientX;
  console.log(e.clientX);

  const images = document.querySelectorAll<HTMLElement>('header > div > img');
  images.forEach(image => {
    image.classList.remove('smooth-transition');
  });
};

const handleMouseMove = (e: MouseEvent) => {
  const images = document.querySelectorAll<HTMLElement>('header > div > img');
  const percentage = (e.clientX - startX.value) / window.outerWidth;
  let xOffset = percentage;

  images.forEach(image => {
    xOffset *= 15;
    image.style.setProperty('--xOffset', `${xOffset}px`);
  });
};

const handleMouseLeave = () => {
  const images = document.querySelectorAll<HTMLElement>('header > div > img');
  images.forEach(image => {
    image.classList.add('smooth-transition');
  });
  images.forEach(image => {
    image.style.setProperty('--xOffset', `${0}px`);
  });
};

onMounted(() => {
  if (headerRef.value) {
    headerRef.value.addEventListener('mouseenter', handleMouseEnter);
    headerRef.value.addEventListener('mousemove', handleMouseMove);
    headerRef.value.addEventListener('mouseleave', handleMouseLeave);
  }
});

onBeforeUnmount(() => {
  if (headerRef.value) {
    headerRef.value.removeEventListener('mouseenter', handleMouseEnter);
    headerRef.value.removeEventListener('mousemove', handleMouseMove);
    headerRef.value.removeEventListener('mouseleave', handleMouseLeave);
  }
});
</script>

<style lang="scss" scoped>
header {
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40%; // 遮罩高度可调整
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent);
    pointer-events: none; // 确保不影响鼠标事件
    z-index: 10; // 确保遮罩在最上层
  }
}

header > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  --xOffset: 0px;
}

header > div > img {
  display: block;
  object-fit: cover;
  height: 100%;
  width: 100%;
  transform: translate(var(--xOffset), var(--xOffset)) scale(1.05);
}

.smooth-transition {
  transition: transform 0.3s ease-out !important;
}
</style>
