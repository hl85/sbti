<template>
  <div class="home-page">
    <div class="hero-card">
      <div class="hero-decoration">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
        <div class="circle c3"></div>
      </div>
      <div class="hero-content">
        <div class="eyebrow">
          <span class="dot"></span>
          <span>Silly Big Personality Test</span>
        </div>
        <h1 class="hero-title">
          MBTI已经过时<br />
          <span class="highlight">SBTI</span>来了。
        </h1>
        <p class="hero-sub">
          31道灵魂拷问，26种抽象人格，精准拿捏你的精神状态。<br />
          本测试仅供娱乐，别拿它当人生判决书。
        </p>
        <div class="hero-actions">
          <button class="btn-primary btn-glow" @click="goTest">
            <span class="btn-icon">🧠</span>
            开始测试
            <span class="btn-arrow">→</span>
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-num">31</span>
            <span class="stat-label">灵魂拷问</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">26</span>
            <span class="stat-label">抽象人格</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">15</span>
            <span class="stat-label">维度评分</span>
          </div>
        </div>
      </div>
    </div>
    <div class="type-preview">
      <h2 class="section-title">部分人格一览</h2>
      <div class="type-grid">
        <div
          v-for="t in previewTypes"
          :key="t.code"
          class="type-chip"
          @click="goShare(t.code)"
        >
          <span class="chip-code">{{ t.code }}</span>
          <span class="chip-cn">{{ t.cn }}</span>
        </div>
        <div class="type-chip more">
          <span>更多等你发现...</span>
        </div>
      </div>
    </div>
    <footer class="footer">
      <p>原作者：<a href="https://space.bilibili.com/417038183" target="_blank">B站@蛆肉儿串儿</a></p>
      <p class="footer-sub">本测试仅供娱乐，请勿用于商业用途</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { TYPE_LIBRARY } from '../data/sbtiData.js'

const router = useRouter()

const allTypes = Object.values(TYPE_LIBRARY)
const previewTypes = allTypes.slice(0, 12)

function goTest() {
  router.push('/test')
}

function goShare(code) {
  router.push(`/share/${code}`)
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 20px 16px 60px;
  max-width: 680px;
  margin: 0 auto;
}

.hero-card {
  position: relative;
  background: linear-gradient(135deg, #1a2e23 0%, #2d4a3a 50%, #1a3a2a 100%);
  border-radius: 28px;
  padding: 48px 32px 40px;
  overflow: hidden;
  margin-top: 20px;
  box-shadow: 0 20px 60px rgba(26, 46, 35, 0.3);
}

.hero-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
}

.c1 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, #7fa586, transparent);
  top: -60px; right: -40px;
}

.c2 {
  width: 120px; height: 120px;
  background: radial-gradient(circle, #a8d5b0, transparent);
  bottom: -30px; left: -20px;
}

.c3 {
  width: 80px; height: 80px;
  background: radial-gradient(circle, #c4e8c8, transparent);
  top: 40%; right: 20%;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #a8d5b0;
  background: rgba(168, 213, 176, 0.1);
  border: 1px solid rgba(168, 213, 176, 0.2);
  border-radius: 999px;
  padding: 8px 14px;
  margin-bottom: 20px;
  letter-spacing: 0.05em;
}

.dot {
  width: 6px; height: 6px;
  background: #7fa586;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.hero-title {
  font-size: clamp(32px, 7vw, 52px);
  line-height: 1.15;
  color: #fff;
  font-weight: 900;
  letter-spacing: -0.03em;
  margin: 0;
}

.highlight {
  background: linear-gradient(135deg, #7fa586, #c4e8c8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  margin-top: 16px;
  color: rgba(255,255,255,0.6);
  font-size: 15px;
  line-height: 1.8;
}

.hero-actions {
  margin-top: 28px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #5b8a63, #7fa586);
  color: #fff;
  border: none;
  padding: 16px 28px;
  border-radius: 16px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(91, 138, 99, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(91, 138, 99, 0.5);
}

.btn-icon { font-size: 20px; }
.btn-arrow { font-size: 20px; transition: transform 0.3s; }
.btn-primary:hover .btn-arrow { transform: translateX(4px); }

.hero-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-num {
  font-size: 24px;
  font-weight: 800;
  color: #a8d5b0;
}

.stat-label {
  font-size: 12px;
  color: rgba(255,255,255,0.45);
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(255,255,255,0.1);
}

.type-preview {
  margin-top: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e2a22;
  margin-bottom: 16px;
}

.type-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #fff;
  border: 1px solid #dbe8dd;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.type-chip:hover {
  border-color: #7fa586;
  background: #f0f7f1;
  transform: translateY(-1px);
}

.chip-code {
  font-weight: 800;
  font-size: 13px;
  color: #4d6a53;
}

.chip-cn {
  font-size: 13px;
  color: #6a786f;
}

.type-chip.more {
  background: #f6faf6;
  color: #6a786f;
  font-size: 13px;
}

.footer {
  margin-top: 48px;
  text-align: center;
  color: #6a786f;
  font-size: 13px;
}

.footer a {
  color: #4d6a53;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.footer-sub {
  margin-top: 6px;
  font-size: 12px;
  color: #9aaa9f;
}

@media (max-width: 600px) {
  .hero-card { padding: 36px 20px 32px; }
  .hero-stats { gap: 14px; }
  .stat-num { font-size: 20px; }
}
</style>
