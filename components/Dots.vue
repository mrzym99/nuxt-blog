<script setup lang="ts">
import { onUnmounted, useTemplateRef, effectScope, onScopeDispose } from 'vue';
import type { Texture } from 'pixi.js';
import { Application, Graphics, Particle, ParticleContainer } from 'pixi.js';
import { createNoise3D } from 'simplex-noise';
import { useEventListener } from '@vueuse/core';
import { useBlogStore } from '~/store';
import { storeToRefs } from 'pinia';

const { getTheme } = storeToRefs(useBlogStore());
const el = useTemplateRef('el');

let w = window.innerWidth;
let h = window.innerHeight;

const SCALE = 200;
const LENGTH = 5;
const SPACING = 15;
let app: Application | null = null;

const noise3d = createNoise3D();

const existingPoints = new Set<string>();
const points: { x: number; y: number; opacity: number; particle: Particle }[] = [];

function getForceOnPoint(x: number, y: number, z: number) {
  return (noise3d(x / SCALE, y / SCALE, z) - 0.5) * 2 * Math.PI;
}

const mountedScope = effectScope();

function createDotTexture(application: Application) {
  const g = new Graphics().circle(0, 0, 1).fill(0xcccccc);
  return application.renderer.generateTexture(g);
}

function addPoints({
  dotTexture,
  particleContainer,
}: {
  dotTexture: Texture;
  particleContainer: ParticleContainer;
}) {
  for (let x = -SPACING / 2; x < w + SPACING; x += SPACING) {
    for (let y = -SPACING / 2; y < h + SPACING; y += SPACING) {
      const id = `${x}-${y}`;
      if (existingPoints.has(id)) continue;
      existingPoints.add(id);

      const particle = new Particle(dotTexture);
      particle.anchorX = 0.5;
      particle.anchorY = 0.5;
      particleContainer.addParticle(particle);

      const opacity = Math.random() * 0.5 + 0.5;
      points.push({ x, y, opacity, particle });
    }
  }
}

async function setup() {
  if (el.value == null) return;
  if (app) {
    existingPoints.clear(); // 清空已有粒子坐标
    points.length = 0; // 清空粒子数组
    safeDestroyApp();
    el.value.innerHTML = ''; // 清空容器
  }
  app = new Application();
  await app.init({
    antialias: true,
    resolution: window.devicePixelRatio,
    resizeTo: el.value,
    eventMode: 'none',
    autoDensity: true,
    background: getTheme.value === 'dark' ? '#333333' : '#ffffff',
  });
  el.value.appendChild(app.canvas);

  const particleContainer = new ParticleContainer({
    dynamicProperties: { position: true, alpha: true },
  });
  app.stage.addChild(particleContainer);

  const dotTexture = createDotTexture(app);
  addPoints({ dotTexture, particleContainer });

  app.ticker.add(() => {
    const t = Date.now() / 10000;

    for (const p of points) {
      const { x, y, opacity, particle } = p;
      const rad = getForceOnPoint(x, y, t);
      const len = (noise3d(x / SCALE, y / SCALE, t * 2) + 0.5) * LENGTH;
      const nx = x + Math.cos(rad) * len;
      const ny = y + Math.sin(rad) * len;

      particle.x = nx;
      particle.y = ny;
      particle.alpha = (Math.abs(Math.cos(rad)) * 0.8 + 0.2) * opacity;
    }
  });

  mountedScope.run(() => {
    useEventListener('resize', () => {
      w = window.innerWidth;
      h = window.innerHeight;
      addPoints({ dotTexture, particleContainer });
    });
  });
}

// 修改销毁逻辑
const safeDestroyApp = () => {
  if (!app) return;

  try {
    // 先停止ticker防止动画循环继续
    app.ticker?.stop();

    // 兼容性销毁方式
    app?.destroy(true, { children: true, texture: true, textureSource: true });

    app = null;
  } catch (e) {
    console.error('PIXI销毁失败:', e);
  }
};

watch(
  () => getTheme.value,
  async () => {
    await setup();
  }
);

onMounted(async () => {
  await setup();
});

onUnmounted(() => {
  mountedScope.stop();
  app?.destroy(true, { children: true, texture: true, textureSource: true });
});
</script>

<template>
  <div
    ref="el"
    fixed
    size-screen
    left-0
    right-0
    top-0
    bottom-0
    pointer-events-none
    dark:invert
    class="bg"
  />
</template>

<style lang="scss" scoped>
@use '~/assets/styles/themes.scss' as *;
@use '~/assets/styles/global.scss' as *;

.bg {
  background: themed('bg');
}
</style>
