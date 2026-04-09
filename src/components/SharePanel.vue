<template>
  <div class="share-overlay" v-if="visible" @click.self="$emit('close')">
    <div class="share-panel">
      <div class="panel-header">
        <h3>分享我的SBTI</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- 分享卡片预览 -->
      <div class="share-preview" ref="shareCardRef">
        <div class="preview-bg">
          <div class="preview-deco"></div>
          <div class="preview-content">
            <div class="preview-badge">SBTI 人格测试</div>
            <div class="preview-type">{{ typeCode }}</div>
            <div class="preview-cn">{{ typeCn }}</div>
            <div class="preview-intro">{{ typeIntro }}</div>
            <div class="preview-match">{{ badge }}</div>
            <div class="preview-footer">
              <span>扫码或访问链接查看详情 →</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="share-actions">
        <button class="share-btn primary" @click="exportImage">
          <span class="share-icon">📸</span>
          <span>保存为图片</span>
        </button>
        <button class="share-btn" @click="copyLink">
          <span class="share-icon">🔗</span>
          <span>复制分享链接</span>
        </button>
      </div>

      <!-- 社交平台分享 -->
      <div class="social-share">
        <p class="social-title">分享到</p>
        <div class="social-grid">
          <button class="social-btn wechat" @click="shareTo('wechat')">
            <span class="social-icon">💬</span>
            <span>微信</span>
          </button>
          <button class="social-btn weibo" @click="shareTo('weibo')">
            <span class="social-icon">📢</span>
            <span>微博</span>
          </button>
          <button class="social-btn qq" @click="shareTo('qq')">
            <span class="social-icon">🐧</span>
            <span>QQ</span>
          </button>
          <button class="social-btn douban" @click="shareTo('douban')">
            <span class="social-icon">🎬</span>
            <span>豆瓣</span>
          </button>
          <button class="social-btn tieba" @click="shareTo('tieba')">
            <span class="social-icon">📘</span>
            <span>贴吧</span>
          </button>
          <button class="social-btn more" @click="nativeShare">
            <span class="social-icon">⋯</span>
            <span>更多</span>
          </button>
        </div>
      </div>

      <!-- Toast 提示 -->
      <transition name="toast">
        <div class="toast" v-if="toastMsg">{{ toastMsg }}</div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import html2canvas from 'html2canvas'

const props = defineProps({
  visible: Boolean,
  typeCode: String,
  typeCn: String,
  typeIntro: String,
  badge: String
})

const emit = defineEmits(['close'])
const shareCardRef = ref(null)
const toastMsg = ref('')
const shareUrl = ref('')

onMounted(() => {
  shareUrl.value = window.location.href.split('#')[0] + '#/share/' + props.typeCode
})

function getShareUrl() {
  return window.location.href.split('#')[0] + '#/share/' + props.typeCode
}

function showToast(msg) {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 2500)
}

async function exportImage() {
  if (!shareCardRef.value) return
  try {
    showToast('正在生成图片...')
    const canvas = await html2canvas(shareCardRef.value, {
      scale: 2,
      useCORS: true,
      backgroundColor: null
    })
    const link = document.createElement('a')
    link.download = `SBTI-${props.typeCode}-${props.typeCn}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    showToast('✅ 图片已保存！')
  } catch (e) {
    showToast('❌ 导出失败，请重试')
  }
}

async function copyLink() {
  const url = getShareUrl()
  try {
    await navigator.clipboard.writeText(url)
    showToast('✅ 链接已复制！')
  } catch {
    // fallback
    const ta = document.createElement('textarea')
    ta.value = url
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    showToast('✅ 链接已复制！')
  }
}

function shareTo(platform) {
  const url = encodeURIComponent(getShareUrl())
  const title = encodeURIComponent(`我的SBTI人格是 ${props.typeCode}（${props.typeCn}）！快来测测你是哪种抽象人格 →`)
  const summary = encodeURIComponent(props.typeIntro)

  const shareUrls = {
    weibo: `https://service.weibo.com/share/share.php?url=${url}&title=${title}`,
    qq: `https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}&summary=${summary}`,
    douban: `https://www.douban.com/share/service?url=${url}&name=${title}`,
    tieba: `http://tieba.baidu.com/f/commit/share/openShareApi?url=${url}&title=${title}`
  }

  if (platform === 'wechat') {
    copyLink()
    showToast('💡 微信请复制链接后粘贴发送')
    return
  }

  if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'width=600,height=500')
  }
}

function nativeShare() {
  if (navigator.share) {
    navigator.share({
      title: `SBTI - ${props.typeCode}（${props.typeCn}）`,
      text: `我的SBTI人格是 ${props.typeCode}（${props.typeCn}）！${props.typeIntro}`,
      url: getShareUrl()
    }).catch(() => {})
  } else {
    copyLink()
  }
}
</script>

<style scoped>
.share-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.share-panel {
  background: #fff;
  border-radius: 24px 24px 0 0;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e2a22;
  margin: 0;
}

.close-btn {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1px solid #e8f0ea;
  background: #f6faf6;
  font-size: 14px;
  color: #6a786f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #edf0ee;
}

.share-preview {
  margin-bottom: 20px;
}

.preview-bg {
  background: linear-gradient(135deg, #1a2e23 0%, #2d4a3a 50%, #1a3a2a 100%);
  border-radius: 18px;
  padding: 32px 24px;
  position: relative;
  overflow: hidden;
}

.preview-deco {
  position: absolute;
  width: 140px; height: 140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(127,165,134,0.2), transparent);
  top: -40px; right: -30px;
}

.preview-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.preview-badge {
  display: inline-block;
  font-size: 11px;
  color: #a8d5b0;
  background: rgba(168,213,176,0.15);
  border: 1px solid rgba(168,213,176,0.25);
  border-radius: 999px;
  padding: 4px 12px;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.preview-type {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.02em;
}

.preview-cn {
  font-size: 18px;
  color: #a8d5b0;
  margin-top: 4px;
}

.preview-intro {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  margin-top: 12px;
  line-height: 1.6;
}

.preview-match {
  display: inline-block;
  margin-top: 16px;
  font-size: 12px;
  font-weight: 700;
  color: #c4e8c8;
  background: rgba(196,232,200,0.1);
  border: 1px solid rgba(196,232,200,0.2);
  border-radius: 999px;
  padding: 6px 14px;
}

.preview-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 12px;
  color: rgba(255,255,255,0.35);
}

.share-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.share-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border-radius: 14px;
  border: 1.5px solid #e8f0ea;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  color: #4d6a53;
  cursor: pointer;
  transition: all 0.2s;
}

.share-btn:hover {
  border-color: #7fa586;
  background: #f6faf6;
}

.share-btn.primary {
  background: linear-gradient(135deg, #5b8a63, #7fa586);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(91,138,99,0.3);
}

.share-btn.primary:hover {
  box-shadow: 0 6px 20px rgba(91,138,99,0.4);
  transform: translateY(-1px);
}

.share-icon { font-size: 18px; }

.social-share {
  padding-top: 20px;
  border-top: 1px solid #edf3ee;
}

.social-title {
  font-size: 13px;
  color: #9aaa9f;
  margin: 0 0 14px;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

.social-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 4px;
  border-radius: 14px;
  border: 1px solid #e8f0ea;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 11px;
  color: #6a786f;
}

.social-btn:hover {
  background: #f6faf6;
  border-color: #c4d8c8;
}

.social-icon { font-size: 22px; }

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
}

.toast-enter-active { animation: toastIn 0.3s ease; }
.toast-leave-active { animation: toastOut 0.3s ease; }

@keyframes toastIn {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes toastOut {
  from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  to { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
}

@media (max-width: 480px) {
  .share-panel { padding: 20px 16px; }
  .social-grid { grid-template-columns: repeat(6, 1fr); gap: 6px; }
  .social-btn { padding: 10px 2px; font-size: 10px; }
}
</style>
