<template>
  <div ref="container" class="home-bg"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import smokePng from '~/assets/images/Smoke-Element.png';

const container = ref<HTMLElement | null>(null);

// 初始化变量
let clock: THREE.Clock,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera;
const smokeParticles: THREE.Mesh[] = [];
let animationFrameId: any = null;

// Three.js初始化
const init = () => {
  // 场景初始化
  clock = new THREE.Clock();
  scene = new THREE.Scene();

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.value!.offsetWidth, container.value!.offsetHeight);
  container.value?.appendChild(renderer.domElement);

  // 相机
  camera = new THREE.PerspectiveCamera(
    75,
    container.value!.offsetWidth / container.value!.offsetHeight,
    1,
    10000
  );
  camera.position.z = 1000;

  // 文字平面
  const textGeo = new THREE.PlaneGeometry(300, 300);
  // 在原有textTexture位置替换为：
  const textCanvas = createGlowText();
  const textTexture = new THREE.CanvasTexture(textCanvas);
  const textMaterial = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    map: textTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  const text = new THREE.Mesh(textGeo, textMaterial);
  text.position.z = 800;
  scene.add(text);

  // 灯光
  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(-1, 0, 1);
  scene.add(light);

  // 初始化烟雾粒子
  initSmokeParticles();
};

// 初始化烟雾粒子
const initSmokeParticles = () => {
  const smokeTexture = new THREE.TextureLoader().load(smokePng);
  const smokeMaterial = new THREE.MeshLambertMaterial({
    color: 0x00dddd,
    map: smokeTexture,
    transparent: true,
  });
  const smokeGeo = new THREE.PlaneGeometry(300, 300);

  for (let p = 0; p < 150; p++) {
    const particle = new THREE.Mesh(smokeGeo, smokeMaterial);
    particle.position.set(
      Math.random() * 500 - 250,
      Math.random() * 500 - 250,
      Math.random() * 1000 - 100
    );
    particle.rotation.z = Math.random() * 360;
    scene.add(particle);
    smokeParticles.push(particle);
  }
};

// 动画循环
const animate = () => {
  const delta = clock.getDelta();

  evolveSmoke(delta);
  render();

  animationFrameId = window.requestAnimationFrame(animate);
};

// 更新烟雾粒子
const evolveSmoke = (delta: number) => {
  smokeParticles.forEach(particle => {
    particle.rotation.z += delta * 0.2;
  });
};

// 渲染场景
const render = () => {
  renderer.render(scene, camera);
};

const createGlowText = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const size = 512;
  canvas.width = size;
  canvas.height = size;

  // 清空画布的正确方式
  ctx.clearRect(0, 0, size, size);

  // 配置字体参数
  const lines = [
    { text: 'Xiao Zhang', size: 72 },
    { text: '「 真理往往简单明了 」', size: 28 },
  ];
  const lineSpacing = 20; // 行间距（非固定行高）
  // 预加载字体（重要！）
  ctx.font = 'normal 80px Arial'; // 预触发字体加载

  // 计算真实行高
  let totalHeight = 0;
  const lineMetrics = lines.map(line => {
    ctx.font = `${line.size}px Arial`;
    const metrics = ctx.measureText(line.text);
    const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    totalHeight += height + lineSpacing;
    return { ...line, metrics, height };
  });
  totalHeight -= lineSpacing; // 去除最后一行多余间距

  // 计算起始位置（精确垂直居中）
  let currentY = (size - totalHeight) / 2 + lineMetrics[0].metrics.actualBoundingBoxAscent;

  // 逐行绘制
  lineMetrics.forEach((line, _index) => {
    ctx.font = `${line.size}px Arial`;

    // 水平居中修正
    const x = size / 2 - line.metrics.width / 2;

    // 三层绘制（保持发光效果）
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 0.25;

    // 第一层发光
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.strokeText(line.text, x, currentY);

    // 第二层描边
    ctx.shadowBlur = 5;
    ctx.strokeText(line.text, x, currentY);

    // 第三层填充
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 0;
    ctx.fillText(line.text, x, currentY);

    // 更新Y坐标（使用真实行高）
    currentY += line.height + lineSpacing;
  });

  return canvas;
};

// 生命周期
onMounted(() => {
  init();
  animate();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', handleResize);
  // 清理Three.js资源
  scene.traverse(child => {
    if (child instanceof THREE.Mesh) {
      if (child.material) {
        child.material.dispose();
      }
      if (child.geometry) {
        child.geometry.dispose();
      }
    }
  });
  renderer.dispose();
});

// 窗口resize处理
const handleResize = () => {
  camera.aspect = container.value!.offsetWidth / container.value!.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.value!.offsetWidth, container.value!.offsetHeight);
};
</script>

<style lang="scss" scoped></style>
