<template>
  <header ref="headerRef">
    <div><img src="../assets//bilibili/banner.webp" /></div>
    <div><img src="../assets//bilibili/cloud.webp" /></div>
    <div><img src="../assets//bilibili/banner1.webp" /></div>
    <div><img src="../assets//bilibili/banner3.webp" /></div>
    <div><img src="../assets//bilibili/banner4.webp" /></div>
    <div><img src="../assets//bilibili/banner5.webp" /></div>
    <div><img src="../assets//bilibili/banner7.webp" /></div>
    <div><img src="../assets//bilibili/banner8.webp" /></div>
    <div><img class="car" src="../assets//bilibili/car.webp" /></div>
    <div><img class="person" src="../assets//bilibili/characterSmall.webp" /></div>
    <div><img src="../assets//bilibili/characterBig.webp" /></div>
    <div><img src="../assets//bilibili/fence.webp" /></div>
    <div><img src="../assets//bilibili/leftBottomGrass.webp" /></div>
    <div><img src="../assets//bilibili/leftTopGrass.webp" /></div>
    <div><img src="../assets//bilibili/rabbit.webp" /></div>
    <div><img src="../assets//bilibili/banner2.webp" /></div>
    <div><img src="../assets//bilibili/banner6.webp" /></div>
    <div>
      <video loop autoplay muted playsinline>
        <source src="../assets/bilibili/video.webm" type="video/webm" />
        您的浏览器不支持 video 标签。
      </video>
    </div>
    <div>
      <h1 class="title leading-tight font-bold mb-6">{{ title }}</h1>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

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

  const images = document.querySelectorAll<HTMLElement>('header > div > img');
  images.forEach(image => {
    image.classList.remove('smooth-transition');
  });
};

const handleMouseMove = (e: MouseEvent) => {
  const images = document.querySelectorAll<HTMLElement>('header > div > img');

  const percentage = (e.clientX - startX.value) / window.outerWidth;
  let xOffset = percentage,
    yOffset = percentage;

  console.log(percentage);

  images.forEach(image => {
    xOffset *= 1.3;
    yOffset *= 1.1;

    image.style.setProperty('--xOffset', `${xOffset}px`);
    image.style.setProperty('--yOffset', `${yOffset}px`);
    image.style.setProperty('--personXoffset', `${-250 + xOffset}px`);
    image.style.setProperty('--personYoffset', `${-30 + yOffset}px`);
    image.style.setProperty('--carXoffset', `${-100 + xOffset}px`);
    image.style.setProperty('--carYoffset', `${20 + yOffset}px`);
  });
};

const handleMouseLeave = () => {
  const images = document.querySelectorAll<HTMLElement>('header > div > img');
  images.forEach(image => {
    image.classList.add('smooth-transition');
  });
  images.forEach(image => {
    image.style.setProperty('--xOffset', `${0}px`);
    image.style.setProperty('--yOffset', `${0}px`);
    image.style.setProperty('--personXoffset', `${-250}px`);
    image.style.setProperty('--personYoffset', `${-30}px`);
    image.style.setProperty('--carXoffset', `${-100}px`);
    image.style.setProperty('--carYoffset', `${20}px`);
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
  height: 155px;
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

.title {
  color: #fff;
  letter-spacing: 3px;
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
  --yOffset: 0px;
  --personXoffset: -250px;
  --personYoffset: -30px;
  --carXoffset: -100px;
  --carYoffset: 20px;
}

header > div > img,
header > div > video {
  display: block;
  object-fit: cover;
  height: 100%;
  width: 100%;
  transform: translate(var(--xOffset), var(--yOffset)) scale(1.1);
}

.smooth-transition {
  transition: transform 0.3s ease-out !important;
}

.person {
  width: 75px;
  height: 60px;
  transform: translate(var(--personXoffset), var(--personYoffset)) !important;
}

.car {
  transform: translate(var(--carXoffset), var(--carYoffset)) !important;
}
</style>
