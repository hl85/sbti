<template>
  <div class="share-page" v-if="typeData">
    <div class="share-card">
      <div class="share-hero">
        <div class="share-badge">SBTI 人格测试</div>
        <div class="share-emoji">{{ getTypeEmoji(typeCode) }}</div>
        <h1 class="share-type">{{ typeCode }}<span class="share-cn">（{{ typeData.cn }}）</span></h1>
        <p class="share-intro">{{ typeData.intro }}</p>
      </div>

      <div class="share-desc">
        <h3>📖 人格解读</h3>
        <p>{{ typeData.desc }}</p>
      </div>

      <div class="share-cta">
        <p>想知道你是哪种抽象人格？</p>
        <button class="btn-go" @click="goTest">🧠 立即测试 →</button>
      </div>

      <div class="share-actions-bar">
        <button class="share-action-btn" @click="copyLink">🔗 复制链接</button>
        <button class="share-action-btn" @click="exportCard">📸 保存图片</button>
        <button class="share-action-btn" @click="nativeShare">🚀 分享</button>
      </div>

      <footer class="share-footer">
        <p>原作者：<a href="https://space.bilibili.com/417038183" target="_blank">B站@蛆肉儿串儿</a></p>
        <p>本测试仅供娱乐</p>
      </footer>
    </div>

    <div class="toast" v-if="toastMsg">{{ toastMsg }}</div>
  </div>

  <div class="not-found" v-else>
    <div class="not-found-card">
      <div class="nf-emoji">❓</div>
      <h2>未找到该人格</h2>
      <p>快去测试看看你是哪种抽象人格吧！</p>
      <button class="btn-go" @click="goTest">🧠 去测试</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TYPE_LIBRARY } from '../data/sbtiData.js'
import html2canvas from 'html2canvas'

const route = useRoute()
const router = useRouter()
const toastMsg = ref('')

const typeCode = computed(() => route.params.type)
const typeData = computed(() => TYPE_LIBRARY[typeCode.value] || null)

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
  setTimeout(() => { toastMsg.value = '' }, 2500)
}

function goTest() {
  router.push('/test')
}

async function copyLink() {
  const url = window.location.href
  try {
    await navigator.clipboard.writeText(url)
    showToast('✅ 链接已复制！')
  } catch {
    const ta = document.createElement('textarea')
    ta.value = url
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    showToast('✅ 链接已复制！')
  }
}

async function exportCard() {
  const card = document.querySelector('.share-card')
  if (!card) return
  try {
    showToast('正在生成图片...')
    const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: '#f6faf6' })
    const link = document.createElement('a')
    link.download = `SBTI-${typeCode.value}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    showToast('✅ 图片已保存！')
  } catch {
    showToast('❌ 导出失败')
  }
}

function nativeShare() {
  if (navigator.share) {
    navigator.share({
      title: `SBTI - ${typeCode.value}（${typeData.value?.cn}）`,
      text: `我的SBTI人格是 ${typeCode.value}（${typeData.value?.cn}）！快来测测你是哪种 →`,
      url: window.location.href
    }).catch(() => {})
  } else {
    copyLink()
  }
}
</script>

<style scoped>
.share-page {
  min-height: 100vh;
  padding: 16px 16px 60px;
  max-width: 520px;
  margin: 0 auto;
}

.share-card {
  background: #fff;
  border-radius: 24px;
  border: 1px solid #e8f0ea;
  box-shadow: 0 8px 32px rgba(47, 73, 55, 0.06);
  overflow: hidden;
  margin-top: 12px;
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
  width: 160px; height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(127,165,134,0.2), transparent);
  top: -50px; right: -40px;
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

.share-cn {
  font-size: 0.5em;
  font-weight: 600;
  color: #a8d5b0;
}

.share-intro {
  font-size: 15px;
  color: rgba(255,255,255,0.65);
  margin-top: 12px;
  line-height: 1.6;
  position: relative;
}

.share-desc {
  padding: 24px;
}

.share-desc h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1e2a22;
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

.share-cta p {
  font-size: 15px;
  color: #6a786f;
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

.share-actions-bar {
  display: flex;
  gap: 10px;
  padding: 0 24px 24px;
}

.share-action-btn {
  flex: 1;
  padding: 12px 8px;
  border-radius: 12px;
  border: 1.5px solid #e8f0ea;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  color: #4d6a53;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.share-action-btn:hover {
  border-color: #7fa586;
  background: #f6faf6;
}

.share-footer {
  padding: 16px 24px;
  border-top: 1px solid #edf3ee;
  text-align: center;
  font-size: 12px;
  color: #9aaa9f;
}

.share-footer a {
  color: #5b8a63;
  text-decoration: none;
}

.share-footer p { margin: 2px 0; }

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
  border: 1px solid #e8f0ea;
  box-shadow: 0 8px 32px rgba(47,73,55,0.06);
}

.nf-emoji { font-size: 56px; margin-bottom: 16px; }

.not-found-card h2 {
  font-size: 20px;
  color: #1e2a22;
  margin: 0 0 8px;
}

.not-found-card p {
  font-size: 14px;
  color: #6a786f;
  margin: 0 0 24px;
}
</style>
