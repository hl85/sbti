<template>
  <div class="share-page" :class="{ 'share-page-cn': isCN }" v-if="typeData">
    <div class="share-topbar">
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

      <button class="home-link" @click="goHome">
        {{ isCN ? '返回首页' : 'Back to Home' }}
      </button>
    </div>

    <div class="share-card" :class="{ 'share-card-cn': isCN }">
      <section class="share-banner">
        <div class="share-decoration" v-if="!isCN">
          <div class="circle c1"></div>
          <div class="circle c2"></div>
          <div class="circle c3"></div>
        </div>

        <div class="share-banner-content">
          <div class="eyebrow">
            <span class="dot"></span>
            <span>{{ isCN ? 'SBTI 经典分享页' : 'SBTI Share Card' }}</span>
          </div>
          <div class="share-title-row">
            <div class="share-emoji">{{ getTypeEmoji(typeCode) }}</div>
            <h1 class="share-type">{{ typeCode }}<span class="share-cn">{{ typeNameText }}</span></h1>
          </div>
        </div>
      </section>

      <template v-if="isCN">
        <section class="share-layout-cn">
          <div class="section-card poster-card" :class="{ 'poster-card-fallback': !showPosterImage }">
            <div v-if="showPosterImage" class="poster-media">
              <div class="poster-overlay">
                <div class="poster-line-2">{{ typeLabel }}</div>
                <div class="poster-line-3">{{ typeCode }}</div>
              </div>
              <img
                :src="posterUrl"
                :alt="`${typeCode} 人格海报`"
                class="share-image-cn"
                crossorigin="anonymous"
                @error="handlePosterError"
              />
            </div>
            <div v-else class="share-fallback-cn">
              <div class="fallback-code">{{ typeCode }}</div>
              <div class="fallback-name">{{ typeData.cn }}</div>
            </div>
            <p class="poster-intro">{{ typeData.intro }}</p>
          </div>

          <div class="info-column">
            <div class="section-card">
              <h3>{{ isCN ? '人格解读' : 'Type Breakdown' }}</h3>
              <p>{{ typeData.desc }}</p>
            </div>

            <div class="section-card">
              <h3>{{ isCN ? '分享操作' : 'Share Actions' }}</h3>
              <div class="share-actions-bar">
                <button class="share-action-btn" @click="copyLink">复制链接</button>
                <button class="share-action-btn share-action-btn-primary" @click="exportCard">保存图片</button>
                <button class="share-action-btn" @click="nativeShare">分享</button>
              </div>
            </div>

            <div class="section-card">
              <h3>{{ isCN ? '继续探索' : 'Keep Exploring' }}</h3>
              <p>{{ isCN ? '想知道你是哪种抽象人格？再做一遍测试，或者切到英文版感受另一套互联网气质。' : 'Curious what this looks like in another language? Re-run the test or flip the edition.' }}</p>
              <div class="section-actions">
                <button class="pill-btn pill-btn-primary" @click="goTest">{{ isCN ? '开始测试' : 'Take the Test' }}</button>
                <button class="pill-btn" @click="switchVersion('en')">EN Edition</button>
              </div>
            </div>
          </div>
        </section>
      </template>

      <template v-else>
        <section class="share-layout-cn">
          <div class="section-card poster-card" :class="{ 'poster-card-fallback': !showPosterImage }">
            <div v-if="showPosterImage" class="poster-media">
              <div class="poster-overlay">
                <div class="poster-line-2">{{ typeLabel }}</div>
                <div class="poster-line-3">{{ typeCode }}</div>
              </div>
              <img
                :src="posterUrl"
                :alt="`${typeCode} poster`"
                class="share-image-cn"
                crossorigin="anonymous"
                @error="handlePosterError"
              />
            </div>
            <div v-else class="share-fallback-cn">
              <div class="fallback-code">{{ typeCode }}</div>
              <div class="fallback-name">{{ typeLabel }}</div>
            </div>
            <p class="poster-intro">{{ typeData.intro }}</p>
          </div>

          <div class="info-column">
            <div class="section-card">
              <h3>Type Breakdown</h3>
              <p>{{ typeData.desc }}</p>
            </div>

            <div class="section-card">
              <h3>Share Actions</h3>
              <div class="share-actions-bar">
                <button class="share-action-btn" @click="copyLink">Copy Link</button>
                <button class="share-action-btn share-action-btn-primary" @click="exportCard">Save Image</button>
                <button class="share-action-btn" @click="nativeShare">Share</button>
              </div>
            </div>

            <div class="section-card">
              <h3>Keep Exploring</h3>
              <p>Send this to a friend, then make them take the test too. Group chat lore writes itself.</p>
              <div class="section-actions">
                <button class="pill-btn pill-btn-primary" @click="goTest">Take the Test</button>
                <button class="pill-btn" @click="switchVersion('cn')">CN Edition</button>
              </div>
            </div>
          </div>
        </section>
      </template>

      <footer class="share-footer">
        <p>{{ isCN ? '原作者：' : 'Original creator:' }}<a href="https://space.bilibili.com/417038183" target="_blank" rel="noreferrer">B站@蛆肉儿串儿</a></p>
        <p>{{ isCN ? '本测试仅供娱乐' : 'Just for fun' }}</p>
      </footer>
    </div>

    <div class="toast" v-if="toastMsg">{{ toastMsg }}</div>
  </div>

  <div class="not-found" v-else>
    <div class="not-found-card">
      <div class="nf-emoji">❓</div>
      <h2>{{ isCN ? '未找到该人格' : 'Type Not Found' }}</h2>
      <p>{{ isCN ? '快去测试看看你是哪种抽象人格吧！' : 'Go take the test to find your vibe!' }}</p>
      <button class="btn-primary" @click="goTest">{{ isCN ? '去测试' : 'Take Test' }}</button>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import html2canvas from 'html2canvas'
import { useRoute, useRouter } from 'vue-router'
import { TYPE_LIBRARY } from '../data/sbtiData.js'
import { TYPE_LIBRARY_EN } from '../data/sbtiDataEN.js'
import { getClassicV1PosterUrl } from '../composables/useTypePoster.js'

export default defineComponent({
  name: 'ShareView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const toastMsg = ref('')
    const posterLoadFailed = ref(false)

    const currentVersion = computed(() => route.params.version === 'cn' ? 'cn' : 'en')
    const isCN = computed(() => currentVersion.value === 'cn')
    const typeCode = computed(() => route.params.type)
    const activeTypeLibrary = computed(() => (isCN.value ? TYPE_LIBRARY : TYPE_LIBRARY_EN))
    const typeData = computed(() => activeTypeLibrary.value[typeCode.value] || null)
    const typeLabel = computed(() => {
      if (!typeData.value) return ''
      return isCN.value ? typeData.value.cn : typeData.value.en
    })
    const typeNameText = computed(() => {
      if (!typeLabel.value) return ''
      return isCN.value ? `（${typeLabel.value}）` : ` (${typeLabel.value})`
    })
    const posterUrl = computed(() => getClassicV1PosterUrl(typeCode.value))
    const showPosterImage = computed(() => Boolean(posterUrl.value && !posterLoadFailed.value))

    watch([typeCode, posterUrl, isCN], () => {
      posterLoadFailed.value = false
    })

    function getTypeEmoji(code) {
      const emojiMap = {
        'CTRL': '🎮', 'ATM-er': '🏧', 'Dior-s': '🪣', 'BOSS': '👔',
        'THAN-K': '🙏', 'OH-NO': '😱', 'GOGO': '🏃', 'SEXY': '✨',
        'LOVE-R': '💕', 'MUM': '🤱', 'FAKE': '🎭', 'OJBK': '🤷',
        'MALO': '🐒', 'JOKE-R': '🤡', 'WOC!': '😮', 'THIN-K': '🧠',
        'SHIT': '💩', 'ZZZZ': '💀', 'POOR': '💸', 'MONK': '🧘',
        'IMSB': '🫠', 'SOLO': '😢', 'FUCK': '🌿', 'DEAD': '👻',
        'IMFW': '🥺', 'HHHH': '😄', 'DRUNK': '🍺'
      }
      return emojiMap[code] || '❓'
    }

    function showToast(msg) {
      toastMsg.value = msg
      setTimeout(() => {
        toastMsg.value = ''
      }, 2500)
    }

    function handlePosterError() {
      posterLoadFailed.value = true
    }

    function goTest() {
      router.push(`/${currentVersion.value}/test`)
    }

    function goHome() {
      router.push(`/${currentVersion.value}`)
    }

    function switchVersion(version) {
      router.push(`/${version}/share/${typeCode.value}`)
    }

     async function copyLink() {
       const url = window.location.href
       try {
         await navigator.clipboard.writeText(url)
         showToast(isCN.value ? '✅ 链接已复制！' : '✅ Link copied!')
       } catch {
         const ta = document.createElement('textarea')
         ta.value = url
         document.body.appendChild(ta)
         ta.select()
         document.execCommand('copy')
         document.body.removeChild(ta)
         showToast(isCN.value ? '✅ 链接已复制！' : '✅ Link copied!')
       }
     }

     async function exportCard() {
       const card = document.querySelector('.share-card')
       if (!card) return

       try {
         showToast(isCN.value ? '正在生成图片...' : 'Generating image...')
         const canvas = await html2canvas(card, {
           scale: 2,
           useCORS: true,
           backgroundColor: isCN.value ? '#f6faf6' : '#f6faf6'
         })
         const link = document.createElement('a')
         link.download = `SBTI-${typeCode.value}.png`
         link.href = canvas.toDataURL('image/png')
         link.click()
         showToast(isCN.value ? '✅ 图片已保存！' : '✅ Image saved!')
       } catch {
         showToast(isCN.value ? '❌ 导出失败' : '❌ Export failed')
       }
     }

     function nativeShare() {
       if (navigator.share) {
         const title = isCN.value 
          ? `SBTI - ${typeCode.value}（${typeLabel.value}）`
          : `SBTI - ${typeCode.value} (${typeLabel.value})`
         const text = isCN.value
          ? `我的SBTI人格是 ${typeCode.value}（${typeLabel.value}）！快来测测你是哪种 →`
          : `My SBTI type is ${typeCode.value} (${typeLabel.value})! Find yours →`
         navigator.share({
           title,
           text,
           url: window.location.href
         }).catch(() => {})
       } else {
         copyLink()
       }
     }

     return {
       copyLink,
       currentVersion,
       exportCard,
       getTypeEmoji,
      goHome,
       goTest,
       handlePosterError,
       isCN,
       nativeShare,
       posterUrl,
       showPosterImage,
       toastMsg,
       typeCode,
      typeData,
      typeLabel,
      typeNameText,
      switchVersion
     }
  }
})
</script>

<style scoped>
.share-page {
  --share-surface: #ffffff;
  --share-line: #dbe8dd;
  --share-soft: #edf6ef;
  --share-accent: #7fa586;
  --share-accent-strong: #4d6a53;
  --share-text: #1e2a22;
  --share-muted: #6a786f;
  min-height: 100vh;
  padding: 20px 16px 60px;
  max-width: 760px;
  margin: 0 auto;
}

.share-page-cn {
  max-width: 980px;
  padding-top: 28px;
}

.share-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
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

.home-link {
  border: 1px solid var(--share-line);
  background: #fff;
  color: var(--share-accent-strong);
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.home-link:hover {
  border-color: #7fa586;
  background: #f6faf6;
}

.share-card {
  background: #fff;
  border-radius: 28px;
  border: 1px solid var(--share-line);
  box-shadow: 0 12px 36px rgba(47, 73, 55, 0.08);
  overflow: hidden;
  margin-top: 16px;
}

.share-card-cn {
  box-shadow: 0 16px 40px rgba(47, 73, 55, 0.08);
}

.share-banner {
  position: relative;
  background: linear-gradient(135deg, #1a2e23 0%, #2d4a3a 50%, #1a3a2a 100%);
  padding: 40px 24px 34px;
  overflow: hidden;
}

.share-decoration {
  position: relative;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
}

.c1 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #7fa586, transparent);
  top: -70px;
  right: -50px;
}

.c2 {
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, #a8d5b0, transparent);
  bottom: -32px;
  left: -18px;
}

.c3 {
  width: 84px;
  height: 84px;
  background: radial-gradient(circle, #c4e8c8, transparent);
  top: 40%;
  right: 20%;
}

.share-banner-content {
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
  margin-bottom: 18px;
  letter-spacing: 0.05em;
}

.dot {
  width: 6px;
  height: 6px;
  background: #7fa586;
  border-radius: 50%;
}

.share-badge {
  display: inline-block;
  font-size: 11px;
  color: #a8d5b0;
  background: rgba(168,213,176,0.15);
  border: 1px solid rgba(168,213,176,0.25);
  border-radius: 999px;
  padding: 4px 14px;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
  position: relative;
}

.share-emoji {
  font-size: 64px;
  margin: 0;
  position: relative;
  line-height: 1;
}

.share-title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 14px;
}

.share-type {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  margin: 0;
  position: relative;
}

.share-cn {
  font-size: 0.5em;
  font-weight: 600;
  color: #a8d5b0;
}

.btn-primary,
.btn-secondary,
.pill-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.25s ease;
}

.btn-primary,
.pill-btn-primary {
  border: none;
  background: linear-gradient(135deg, #5b8a63, #7fa586);
  color: #fff;
  box-shadow: 0 8px 24px rgba(91, 138, 99, 0.4);
}

.btn-primary {
  padding: 16px 28px;
  font-size: 16px;
}

.btn-primary:hover,
.pill-btn-primary:hover {
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

.share-layout-cn,
.share-content {
  padding: 20px;
}

.share-layout-cn {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 18px;
}

.share-content {
  display: grid;
  gap: 18px;
}

.share-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.info-column {
  display: grid;
  gap: 18px;
}

.section-card {
  border: 1px solid var(--share-line);
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff, #fbfdfb);
  padding: 20px;
  box-shadow: 0 8px 24px rgba(47, 73, 55, 0.04);
}

.section-card-wide {
  min-height: 0;
}

.section-card h3 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 800;
  color: var(--share-text);
}

.section-card p {
  margin: 0;
  font-size: 14px;
  color: #304034;
  line-height: 1.9;
  white-space: pre-wrap;
}

.poster-card {
  min-height: 520px;
  padding: 18px;
  background:
    radial-gradient(circle at top right, rgba(127, 165, 134, 0.16), rgba(127, 165, 134, 0) 40%),
    linear-gradient(180deg, #ffffff, #f4f8f4);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 0;
}

.share-image-cn {
  width: 100%;
  height: auto;
  max-height: 480px;
  object-fit: contain;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
}

.poster-media {
  position: relative;
  width: 100%;
  height: auto;
  flex: 0 0 auto;
  min-height: 360px;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 14px 12px 10px;
}

.poster-overlay {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  pointer-events: none;
  margin-bottom: 10px;
}

.poster-line-2 {
  font-size: clamp(28px, 3vw, 38px);
  font-weight: 900;
  letter-spacing: -0.03em;
  color: rgba(30, 42, 34, 0.92);
  text-shadow: 0 2px 0 rgba(255, 255, 255, 0.9);
  max-width: 100%;
  line-height: 1.08;
}

.poster-line-3 {
  font-size: clamp(26px, 2.6vw, 34px);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--share-accent-strong);
  text-shadow: 0 2px 0 rgba(255, 255, 255, 0.9);
}

.share-fallback-cn {
  width: 100%;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
}

.fallback-code {
  font-size: clamp(40px, 7vw, 64px);
  font-weight: 900;
  color: var(--share-text);
  line-height: 1;
}

.fallback-name {
  margin-top: 12px;
  font-size: 24px;
  font-weight: 800;
  color: var(--share-accent-strong);
}

.fallback-intro {
  margin-top: 14px !important;
  color: var(--share-muted) !important;
}

.poster-intro {
  margin: 14px 0 0;
  font-size: 20px;
  font-weight: 700;
  color: #1f2f24;
  line-height: 1.4;
  text-align: left;
}

.share-actions-bar {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.share-action-btn {
  flex: 1;
  padding: 12px 10px;
  border-radius: 12px;
  border: 1.5px solid var(--share-line);
  background: #fff;
  font-size: 13px;
  font-weight: 700;
  color: var(--share-accent-strong);
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.share-action-btn:hover,
.pill-btn:hover {
  border-color: #7fa586;
  background: #f6faf6;
}

.share-action-btn-primary {
  background: linear-gradient(135deg, #5b8a63, #7fa586);
  color: #fff;
  border-color: transparent;
}

.section-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.pill-btn {
  border: 1px solid var(--share-line);
  background: #fff;
  color: var(--share-accent-strong);
  padding: 12px 16px;
  font-size: 13px;
}

.share-footer {
  padding: 18px 24px 22px;
  border-top: 1px solid #edf3ee;
  text-align: center;
  font-size: 12px;
  color: #9aaa9f;
}

.share-footer a {
  color: var(--share-accent);
  text-decoration: none;
}

.share-footer p {
  margin: 2px 0;
}

.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(30, 42, 34, 0.9);
  color: #fff;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  z-index: 2000;
  pointer-events: none;
  animation: toastAnim 2.5s ease forwards;
}

@keyframes toastAnim {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
  10% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  80% { opacity: 1; }
  100% { opacity: 0; }
}

.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.not-found-card {
  text-align: center;
  background: #fff;
  border-radius: 24px;
  padding: 48px 32px;
  border: 1px solid var(--share-line);
  box-shadow: 0 8px 32px rgba(47,73,55,0.06);
}

.nf-emoji {
  font-size: 56px;
  margin-bottom: 16px;
}

.not-found-card h2 {
  font-size: 20px;
  color: var(--share-text);
  margin: 0 0 8px;
}

.not-found-card p {
  font-size: 14px;
  color: var(--share-muted);
  margin: 0 0 24px;
}

@media (max-width: 860px) {
  .share-layout-cn {
    grid-template-columns: 1fr;
  }

  .share-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .share-topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .share-banner {
    padding: 36px 20px 30px;
  }

  .share-content,
  .share-layout-cn {
    padding: 16px;
  }

  .share-actions-bar,
  .section-actions {
    flex-direction: column;
  }

  .poster-card {
    min-height: 300px;
    padding: 14px;
  }

  .poster-media {
    padding: 12px 10px 8px;
  }

  .poster-line-2 {
    font-size: clamp(24px, 8vw, 34px);
  }

  .poster-line-3 {
    font-size: clamp(22px, 7vw, 30px);
  }
}
</style>
