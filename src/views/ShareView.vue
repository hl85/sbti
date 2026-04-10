<template>
  <div class="share-page" :class="{ 'share-page-cn': isCN }" v-if="typeData">
    <div class="share-card" :class="{ 'share-card-cn': isCN }">
      <template v-if="isCN">
        <div class="share-layout-cn">
          <div class="share-poster-cn" :class="{ 'share-poster-cn--fallback': !showPosterImage }">
            <img
              v-if="showPosterImage"
              :src="posterUrl"
              :alt="`${typeCode} 人格海报`"
              class="share-image-cn"
              @error="handlePosterError"
            />
            <div v-else class="share-fallback-cn">
              <div class="share-type share-type-cn">{{ typeCode }}</div>
              <div class="share-cn share-cn-cn">{{ typeData.cn }}</div>
              <p class="share-intro share-intro-cn">{{ typeData.intro }}</p>
            </div>
          </div>

          <div class="share-info-cn">
            <div class="share-badge share-badge-cn">SBTI 人格测试</div>
            <h1 class="share-type share-type-cn">{{ typeCode }}<span class="share-cn share-cn-cn">（{{ typeData.cn }}）</span></h1>
            <p class="share-intro share-intro-cn">{{ typeData.intro }}</p>

            <div class="share-desc share-desc-cn">
              <h3>人格解读</h3>
              <p>{{ typeData.desc }}</p>
            </div>

            <div class="share-actions-bar share-actions-bar-cn">
              <button class="share-action-btn" @click="copyLink">复制链接</button>
              <button class="share-action-btn share-action-btn-primary" @click="exportCard">保存图片</button>
              <button class="share-action-btn" @click="nativeShare">分享</button>
            </div>

            <div class="share-cta share-cta-cn">
              <p>想知道你是哪种抽象人格？</p>
              <button class="btn-go btn-go-cn" @click="goTest">开始测试</button>
            </div>
          </div>
        </div>
      </template>

       <template v-else>
         <div class="share-hero">
           <div class="share-badge">{{ isCN ? 'SBTI 人格测试' : 'SBTI Personality Test' }}</div>
           <div class="share-emoji">{{ getTypeEmoji(typeCode) }}</div>
           <h1 class="share-type">{{ typeCode }}<span class="share-cn">{{ typeNameText }}</span></h1>
           <p class="share-intro">{{ typeData.intro }}</p>
         </div>

         <div class="share-desc">
           <h3>📖 {{ isCN ? '人格解读' : 'Type Breakdown' }}</h3>
           <p>{{ typeData.desc }}</p>
         </div>

         <div class="share-cta">
           <p>{{ isCN ? '想知道你是哪种抽象人格？' : 'What\'s your vibe?' }}</p>
           <button class="btn-go" @click="goTest">🧠 {{ isCN ? '立即测试 →' : 'Take the Test →' }}</button>
         </div>

         <div class="share-actions-bar">
           <button class="share-action-btn" @click="copyLink">🔗 {{ isCN ? '复制链接' : 'Copy Link' }}</button>
           <button class="share-action-btn" @click="exportCard">📸 {{ isCN ? '保存图片' : 'Save Image' }}</button>
           <button class="share-action-btn" @click="nativeShare">🚀 {{ isCN ? '分享' : 'Share' }}</button>
         </div>
       </template>

       <footer class="share-footer" :class="{ 'share-footer-cn': isCN }">
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
       <button class="btn-go" @click="goTest">🧠 {{ isCN ? '去测试' : 'Take Test' }}</button>
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
    const posterUrl = computed(() => (isCN.value ? getClassicV1PosterUrl(typeCode.value) : ''))
    const showPosterImage = computed(() => Boolean(isCN.value && posterUrl.value && !posterLoadFailed.value))

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
      typeNameText
     }
  }
})
</script>

<style scoped>
.share-page {
  --share-line: #e8f0ea;
  --share-soft: #edf6ef;
  --share-accent: #5b8a63;
  --share-accent-strong: #4d6a53;
  --share-text: #1e2a22;
  --share-muted: #6a786f;
  min-height: 100vh;
  padding: 16px 16px 60px;
  max-width: 520px;
  margin: 0 auto;
}

.share-page-cn {
  max-width: 980px;
}

.share-card {
  background: #fff;
  border-radius: 24px;
  border: 1px solid var(--share-line);
  box-shadow: 0 8px 32px rgba(47, 73, 55, 0.06);
  overflow: hidden;
  margin-top: 12px;
}

.share-card-cn {
  padding: 18px;
  box-shadow: 0 16px 40px rgba(47, 73, 55, 0.08);
}

.share-layout-cn {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 18px;
}

.share-poster-cn,
.share-info-cn,
.share-desc-cn {
  border: 1px solid var(--share-line);
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff, #fbfdfb);
}

.share-poster-cn {
  min-height: 420px;
  padding: 18px;
  background:
    radial-gradient(circle at top right, rgba(127, 165, 134, 0.16), rgba(127, 165, 134, 0) 40%),
    linear-gradient(180deg, #ffffff, #f4f8f4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-image-cn {
  width: 100%;
  height: 100%;
  max-height: 560px;
  object-fit: contain;
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

.share-info-cn {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.share-hero {
  background: linear-gradient(135deg, #1a2e23, #2d4a3a);
  padding: 40px 24px 36px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.share-hero::after {
  content: '';
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(127,165,134,0.2), transparent);
  top: -50px;
  right: -40px;
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

.share-badge-cn {
  color: var(--share-accent-strong);
  background: var(--share-soft);
  border-color: #dbe8dd;
  margin-bottom: 0;
}

.share-emoji {
  font-size: 64px;
  margin-bottom: 12px;
  position: relative;
}

.share-type {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  margin: 0;
  position: relative;
}

.share-type-cn {
  color: var(--share-text);
  font-size: clamp(34px, 6vw, 48px);
  line-height: 1.08;
  letter-spacing: -0.03em;
}

.share-cn {
  font-size: 0.5em;
  font-weight: 600;
  color: #a8d5b0;
}

.share-cn-cn {
  color: var(--share-accent-strong);
}

.share-intro {
  font-size: 15px;
  color: rgba(255,255,255,0.65);
  margin-top: 12px;
  line-height: 1.6;
  position: relative;
}

.share-intro-cn {
  margin-top: 0;
  color: var(--share-muted);
  line-height: 1.8;
}

.share-desc {
  padding: 24px;
}

.share-desc-cn {
  padding: 18px;
}

.share-desc h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--share-text);
  margin: 0 0 12px;
}

.share-desc p {
  font-size: 14px;
  color: #304034;
  line-height: 1.9;
  white-space: pre-wrap;
  margin: 0;
}

.share-cta {
  padding: 0 24px 24px;
  text-align: center;
}

.share-cta-cn {
  padding: 0;
  text-align: left;
}

.share-cta p {
  font-size: 15px;
  color: var(--share-muted);
  margin: 0 0 16px;
}

.btn-go {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #5b8a63, #7fa586);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(91,138,99,0.3);
  transition: all 0.3s;
}

.btn-go:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(91,138,99,0.4);
}

.btn-go-cn {
  padding-inline: 24px;
}

.share-actions-bar {
  display: flex;
  gap: 10px;
  padding: 0 24px 24px;
}

.share-actions-bar-cn {
  padding: 0;
}

.share-action-btn {
  flex: 1;
  padding: 12px 8px;
  border-radius: 12px;
  border: 1.5px solid var(--share-line);
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  color: var(--share-accent-strong);
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.share-action-btn:hover {
  border-color: #7fa586;
  background: #f6faf6;
}

.share-action-btn-primary {
  background: linear-gradient(135deg, #5b8a63, #7fa586);
  color: #fff;
  border-color: transparent;
}

.share-footer {
  padding: 16px 24px;
  border-top: 1px solid #edf3ee;
  text-align: center;
  font-size: 12px;
  color: #9aaa9f;
}

.share-footer-cn {
  margin-top: 18px;
  padding: 16px 6px 4px;
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
}

@media (max-width: 600px) {
  .share-actions-bar,
  .share-actions-bar-cn {
    flex-direction: column;
  }

  .share-card-cn {
    padding: 14px;
  }

  .share-poster-cn {
    min-height: 300px;
    padding: 14px;
  }
}
</style>
