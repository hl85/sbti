<template>
  <div class="gallery-page" :class="`gallery-page-${currentVersion}`">
    <section class="gallery-hero">
      <div class="hero-decoration" v-if="!isCN">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
        <div class="circle c3"></div>
      </div>

      <div class="gallery-hero-content">
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

        <div class="eyebrow">
          <span class="dot"></span>
          <span>{{ isCN ? 'SBTI 人格图鉴' : 'SBTI Type Gallery' }}</span>
        </div>

        <h1 class="hero-title">
          {{ isCN ? '全人类精神状态图鉴' : 'The Complete Vibe Encyclopedia' }}
        </h1>
        <p class="hero-sub">
          {{ isCN
            ? '把所有人格放进同一套视觉体系里，像翻一本抽象互联网百科。'
            : 'Every type, one clean scrollable gallery. Think meme taxonomy, but make it pretty.' }}
        </p>

        <div class="hero-actions">
          <button class="btn-primary" @click="goHome">
            <span>{{ isCN ? '返回首页' : 'Back to Home' }}</span>
          </button>
          <button class="btn-secondary" @click="goTest">
            <span>{{ isCN ? '开始测试' : 'Take the Test' }}</span>
          </button>
        </div>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-num">{{ galleryItems.length }}</span>
            <span class="stat-label">{{ isCN ? '人格卡片' : 'Type Cards' }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">31</span>
            <span class="stat-label">{{ isCN ? '测试题目' : 'Questions' }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">15</span>
            <span class="stat-label">{{ isCN ? '维度模型' : 'Dimensions' }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="gallery-section">
      <div class="section-head">
        <div>
          <h2 class="section-title">{{ isCN ? '全部人格' : 'All Types' }}</h2>
          <p class="section-copy">
            {{ isCN
              ? '点击人格形象卡片，快速查看并跳转到对应分享页。'
              : 'Browse visual type cards and jump to each share page in one tap.' }}
          </p>
        </div>
        <button class="section-link" @click="goHome">
          {{ isCN ? '回首页 →' : 'Home →' }}
        </button>
      </div>

      <div class="cards-grid">
        <article
          v-for="item in galleryItems"
          :key="item.code"
          class="gallery-card"
          @click="goShare(item.code)"
        >
          <div class="card-top">
            <span class="type-code">{{ item.code }}</span>
            <span class="card-link">{{ isCN ? '查看分享页' : 'Open Share' }}</span>
          </div>

          <div class="card-poster">
            <div class="card-overlay">
              <div class="overlay-line-2">{{ isCN ? item.cn : item.en }}</div>
              <div class="overlay-line-3">{{ item.code }}</div>
            </div>
            <img
              :src="getClassicV1PosterUrl(item.code)"
              :alt="`${item.code} poster`"
              class="card-image"
              crossorigin="anonymous"
            />
          </div>

          <div class="card-name-block">
            <h3 class="type-name">{{ item.code }}<span class="type-subname-inline">{{ isCN ? `（${item.cn}）` : ` (${item.en})` }}</span></h3>
          </div>

          <p class="card-intro">{{ item.intro }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TYPE_LIBRARY } from '../data/sbtiData.js'
import { TYPE_LIBRARY_EN } from '../data/sbtiDataEN.js'
import { getClassicV1PosterUrl } from '../composables/useTypePoster.js'

const router = useRouter()
const route = useRoute()

const currentVersion = computed(() => {
  return route.params.version === 'cn' ? 'cn' : 'en'
})

const isCN = computed(() => currentVersion.value === 'cn')

const displayLibrary = computed(() => {
  return currentVersion.value === 'cn' ? TYPE_LIBRARY : TYPE_LIBRARY_EN
})

const galleryItems = computed(() => Object.values(displayLibrary.value))

const switchVersion = (ver) => {
  router.push(`/${ver}/gallery`)
}

const goHome = () => {
  router.push(`/${currentVersion.value}`)
}

const goTest = () => {
  router.push(`/${currentVersion.value}/test`)
}

const goShare = (code) => {
  router.push(`/${currentVersion.value}/share/${code}`)
}
</script>

<style scoped>
.gallery-page {
  --gallery-surface: #ffffff;
  --gallery-line: #dbe8dd;
  --gallery-soft: #edf6ef;
  --gallery-accent: #7fa586;
  --gallery-accent-strong: #4d6a53;
  --gallery-text: #1e2a22;
  --gallery-muted: #6a786f;
  min-height: 100vh;
  padding: 20px 16px 60px;
  max-width: 1120px;
  margin: 0 auto;
}

.gallery-page-cn {
  max-width: 1180px;
  padding-top: 28px;
}

.gallery-hero {
  position: relative;
  background: linear-gradient(135deg, #1a2e23 0%, #2d4a3a 50%, #1a3a2a 100%);
  border-radius: 28px;
  padding: 40px 28px 36px;
  overflow: hidden;
  margin-top: 20px;
  box-shadow: 0 20px 60px rgba(26, 46, 35, 0.3);
}

.gallery-hero-content {
  position: relative;
  z-index: 1;
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
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, #7fa586, transparent);
  top: -70px;
  right: -50px;
}

.c2 {
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, #a8d5b0, transparent);
  bottom: -40px;
  left: -25px;
}

.c3 {
  width: 90px;
  height: 90px;
  background: radial-gradient(circle, #c4e8c8, transparent);
  top: 44%;
  right: 22%;
}

.version-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  width: fit-content;
  border-radius: 999px;
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

.toggle-btn.active {
  color: #fff;
  background: linear-gradient(135deg, #5b8a63, #7fa586);
  box-shadow: 0 6px 16px rgba(91, 138, 99, 0.35);
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
  margin: 18px 0 20px;
  letter-spacing: 0.05em;
}

.dot {
  width: 6px;
  height: 6px;
  background: #7fa586;
  border-radius: 50%;
}

.hero-title {
  font-size: clamp(32px, 5vw, 52px);
  line-height: 1.12;
  color: #fff;
  font-weight: 900;
  letter-spacing: -0.03em;
  margin: 0;
}

.hero-sub {
  margin: 16px 0 0;
  max-width: 680px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 15px;
  line-height: 1.8;
}

.hero-actions {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.25s ease;
}

.btn-primary {
  border: none;
  background: linear-gradient(135deg, #5b8a63, #7fa586);
  color: #fff;
  padding: 16px 28px;
  font-size: 16px;
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
  font-size: 14px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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
  color: rgba(255, 255, 255, 0.45);
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
}

.gallery-section {
  margin-top: 28px;
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.section-title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: var(--gallery-text);
}

.section-copy {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--gallery-muted);
  line-height: 1.7;
}

.section-link {
  border: none;
  background: transparent;
  color: var(--gallery-accent-strong);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.gallery-card {
  background: #fff;
  border-radius: 22px;
  border: 1px solid var(--gallery-line);
  padding: 16px;
  box-shadow: 0 8px 32px rgba(47, 73, 55, 0.06);
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.gallery-card:hover {
  transform: translateY(-3px);
  border-color: #7fa586;
  background: linear-gradient(180deg, #ffffff, #fbfdfb);
  box-shadow: 0 14px 36px rgba(47, 73, 55, 0.1);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.type-code {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--gallery-soft);
  color: var(--gallery-accent-strong);
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.06em;
}

.card-link {
  font-size: 12px;
  color: var(--gallery-muted);
}

.card-name-block {
  margin-top: 12px;
}

.type-name {
  margin: 0;
  font-size: 24px;
  line-height: 1.15;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--gallery-text);
}

.type-subname-inline {
  margin-left: 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--gallery-muted);
}

.card-intro {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: #304034;
  font-weight: 600;
}

.card-poster {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  min-height: 0;
  background:
    radial-gradient(circle at top right, rgba(127, 165, 134, 0.16), rgba(127, 165, 134, 0) 42%),
    linear-gradient(180deg, #ffffff, #f4f8f4);
  border: 1px solid var(--gallery-line);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 14px 12px 10px;
}

.card-image {
  width: 100%;
  height: auto;
  max-height: 340px;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.72);
}

.card-overlay {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  pointer-events: none;
  margin-bottom: 10px;
}

.overlay-line-2 {
  font-size: clamp(28px, 2.4vw, 38px);
  font-weight: 900;
  letter-spacing: -0.03em;
  color: rgba(30, 42, 34, 0.92);
  text-shadow: 0 2px 0 rgba(255, 255, 255, 0.9);
  line-height: 1.08;
  max-width: 100%;
}

.overlay-line-3 {
  font-size: clamp(26px, 2.1vw, 34px);
  font-weight: 900;
  color: var(--gallery-accent-strong);
  text-shadow: 0 2px 0 rgba(255, 255, 255, 0.9);
  line-height: 1.05;
}

@media (max-width: 760px) {
  .section-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-stats {
    gap: 14px;
  }
}

@media (max-width: 600px) {
  .gallery-hero {
    padding: 36px 20px 32px;
  }

  .hero-title {
    font-size: 34px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .card-poster {
    padding: 12px 10px 8px;
  }

  .overlay-line-2 {
    font-size: clamp(24px, 8vw, 34px);
  }

  .overlay-line-3 {
    font-size: clamp(22px, 7vw, 30px);
  }
}
</style>
