<template>
  <div class="home-page" :class="`home-page-${currentVersion}`">
    <div class="hero-card" :class="{ 'hero-card-cn': isCN }">
      <div v-if="!isCN" class="hero-decoration">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
        <div class="circle c3"></div>
      </div>

      <div class="hero-content" :class="{ 'hero-content-cn': isCN }">
        <div class="version-toggle">
          <button
            class="toggle-btn"
            :class="{ active: currentVersion === 'cn' }"
            @click="switchVersion('cn')"
          >
            CN
          </button>
          <button
            class="toggle-btn"
            :class="{ active: currentVersion === 'en' }"
            @click="switchVersion('en')"
          >
            EN
          </button>
        </div>

        <template v-if="isCN">
          <div class="eyebrow">
            <span class="dot"></span>
            <span>Silly Big Personality Test</span>
          </div>
          <h1 class="hero-title hero-title-cn">
            MBTI 已经过时<br />
            <span class="highlight">SBTI</span> 来了
          </h1>
          <p class="hero-sub hero-sub-cn">
            31 道灵魂拷问，26 种抽象人格，精准拿捏你的精神状态。<br />
            仅供娱乐，请勿过度对号入座。
          </p>
          <div class="hero-actions hero-actions-cn">
            <button class="btn-primary btn-primary-cn" @click="goTest">
              <span class="btn-icon">🧠</span>
              开始测试
              <span class="btn-arrow">→</span>
            </button>
            <button class="btn-secondary btn-secondary-cn" @click="goWhatIsSbti">什么是 SBTI？</button>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-num">31</span>
              <span class="stat-label">题目</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-num">26</span>
              <span class="stat-label">人格类型</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-num">15</span>
              <span class="stat-label">维度评分</span>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="eyebrow">
            <span class="dot"></span>
            <span>Silly Big Personality Test</span>
          </div>
          <h1 class="hero-title">
            MBTI is dead<br />
            <span class="highlight">SBTI</span> just dropped.
          </h1>
          <p class="hero-sub">
            31 unhinged questions. 26 chaotic personality types. We'll clock your entire vibe.<br />
            Just for fun. Don't take it too seriously.
          </p>
          <div class="hero-actions">
            <button class="btn-primary btn-glow" @click="goTest">
              <span class="btn-icon">🧠</span>
              Take the Test
              <span class="btn-arrow">→</span>
            </button>
            <button class="btn-secondary" @click="goWhatIsSbti">What is SBTI?</button>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-num">31</span>
              <span class="stat-label">Questions</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-num">26</span>
              <span class="stat-label">Personality Types</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-num">15</span>
              <span class="stat-label">Dimensions</span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="type-preview" :class="{ 'type-preview-cn': isCN }">
      <h2 class="section-title">{{ isCN ? '经典人格一览' : 'Preview Some Types' }}</h2>
      <p v-if="isCN" class="preview-copy">更接近原版的轻量入口，点任意人格可直接查看经典海报页。</p>
      <p v-else class="preview-copy">Click any type to see your vibe.</p>
      <div class="type-grid">
        <div
          v-for="t in visiblePreviewTypes"
          :key="t.code"
          class="type-chip"
          @click="goShare(t.code)"
        >
          <span class="chip-code">{{ t.code }}</span>
          <span class="chip-cn">{{ isCN ? t.cn : t.name }}</span>
        </div>
        <div class="type-chip more" @click="goGallery">
          <span>{{ isCN ? '查看全部人格 →' : 'View All Types →' }}</span>
        </div>
      </div>
    </div>

    <footer class="footer" :class="{ 'footer-cn': isCN }">
      <p>{{ isCN ? '原作者：' : 'Original creator:' }}<a href="https://space.bilibili.com/417038183" target="_blank">B站@蛆肉儿串儿</a></p>
      <p class="footer-sub">{{ isCN ? '本测试仅供娱乐，请勿用于商业用途' : 'Just for fun. Not for commercial use.' }}</p>
    </footer>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TYPE_LIBRARY } from '../data/sbtiData.js'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const route = useRoute()

    const allTypes = Object.values(TYPE_LIBRARY)
    const previewTypes = allTypes.slice(0, 12)
    const currentVersion = computed(() => route.params.version === 'cn' ? 'cn' : 'en')
    const isCN = computed(() => currentVersion.value === 'cn')
    const visiblePreviewTypes = computed(() => (isCN.value ? previewTypes.slice(0, 8) : previewTypes))

    function goTest() {
      router.push(`/${currentVersion.value}/test`)
    }

    function goShare(code) {
      router.push(`/${currentVersion.value}/share/${code}`)
    }

    function goGallery() {
      router.push(`/${currentVersion.value}/gallery`)
    }

    function goWhatIsSbti() {
      router.push('/what-is-sbti')
    }

    function switchVersion(ver) {
      router.push(`/${ver}`)
    }

    return {
      currentVersion,
      goGallery,
      goShare,
      goTest,
      goWhatIsSbti,
      isCN,
      switchVersion,
      visiblePreviewTypes
    }
  }
})
</script>

<style scoped>
.home-page {
  --home-surface: #ffffff;
  --home-line: #dbe8dd;
  --home-soft: #edf6ef;
  --home-accent: #7fa586;
  --home-accent-strong: #4d6a53;
  --home-text: #1e2a22;
  --home-muted: #6a786f;
  min-height: 100vh;
  padding: 20px 16px 60px;
  max-width: 680px;
  margin: 0 auto;
}

.home-page-cn {
  max-width: 760px;
  padding-top: 28px;
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

.hero-card-cn {
  background: linear-gradient(135deg, #1a2e23 0%, #2d4a3a 50%, #1a3a2a 100%);
  box-shadow: 0 20px 60px rgba(26, 46, 35, 0.3);
  padding: 48px 32px 40px;
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

.hero-content-cn {
  max-width: 640px;
}

.version-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 999px;
  border: 1px solid rgba(168, 213, 176, 0.25);
  background: rgba(12, 24, 18, 0.28);
}

.hero-content-cn .version-toggle {
  border: 1px solid rgba(168, 213, 176, 0.25);
  background: rgba(12, 24, 18, 0.28);
}

.toggle-btn {
  border: none;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hero-content-cn .toggle-btn {
  color: rgba(255, 255, 255, 0.75);
}

.toggle-btn.active {
  color: #fff;
  background: linear-gradient(135deg, #5b8a63, #7fa586);
  box-shadow: 0 6px 16px rgba(91, 138, 99, 0.35);
}

.hero-content-cn .toggle-btn.active {
  color: #fff;
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

.hero-title-cn {
  color: #fff;
  letter-spacing: -0.035em;
}

.hero-sub-cn {
  color: rgba(255,255,255,0.68);
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
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hero-actions-cn {
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

.btn-primary-cn {
  padding: 16px 28px;
  border-radius: 16px;
  font-size: 17px;
  background: linear-gradient(135deg, #5b8a63, #7fa586);
  box-shadow: 0 8px 24px rgba(91, 138, 99, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(91, 138, 99, 0.5);
}

.btn-secondary {
  border: 1px solid rgba(168, 213, 176, 0.4);
  background: rgba(255, 255, 255, 0.06);
  color: #d3e9d7;
  padding: 12px 18px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.btn-secondary-cn {
  border: 1px solid rgba(168, 213, 176, 0.4);
  background: rgba(255, 255, 255, 0.06);
  color: #d3e9d7;
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

.type-preview-cn {
  margin-top: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e2a22;
  margin-bottom: 16px;
}

.preview-copy {
  margin: -6px 0 14px;
  font-size: 13px;
  color: var(--home-muted);
  line-height: 1.7;
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
  border: 1px solid var(--home-line);
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
  background: var(--home-soft);
  color: var(--home-muted);
  font-size: 13px;
}

.footer {
  margin-top: 48px;
  text-align: center;
  color: #6a786f;
  font-size: 13px;
}

.footer-cn {
  margin-top: 28px;
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
  .hero-card-cn { padding: 36px 20px 32px; }
  .hero-stats { gap: 14px; }
  .stat-num { font-size: 20px; }
}
</style>
