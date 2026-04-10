<template>
  <div class="share-overlay" v-if="visible" @click.self="$emit('close')">
    <div class="share-panel" :class="{ 'share-panel-cn': isCN }">
      <div class="panel-header">
        <h3>{{ isCN ? '分享经典结果页' : '分享我的SBTI' }}</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="share-preview" ref="shareCardRef">
        <div v-if="isCN" class="preview-bg preview-bg-cn">
          <div class="preview-classic-cn">
            <div class="preview-poster-cn" :class="{ 'preview-poster-cn--fallback': !showPosterImage }">
              <img
                v-if="showPosterImage"
                :src="posterUrl"
                :alt="`${typeCode} 分享海报`"
                class="preview-image-cn"
                @error="handlePosterError"
              />
              <div v-else class="preview-fallback-cn">
                <div class="preview-type preview-type-cn">{{ typeCode }}</div>
                <div class="preview-cn preview-cn-cn">{{ typeLabel }}</div>
              </div>
            </div>
            <div class="preview-info-cn">
              <div class="preview-badge preview-badge-cn">SBTI 人格测试</div>
              <div class="preview-type preview-type-cn">{{ typeCode }}</div>
              <div class="preview-cn preview-cn-cn">{{ typeLabel }}</div>
              <div class="preview-intro preview-intro-cn">{{ typeIntro }}</div>
              <div class="preview-match preview-match-cn">{{ badge }}</div>
              <div class="preview-footer preview-footer-cn">经典结果图风格分享页</div>
            </div>
          </div>
        </div>

         <div v-else class="preview-bg">
           <div class="preview-deco"></div>
           <div class="preview-content">
             <div class="preview-badge">{{ isCN ? 'SBTI 人格测试' : 'SBTI Personality Test' }}</div>
             <div class="preview-type">{{ typeCode }}</div>
             <div class="preview-cn">{{ typeLabel }}</div>
             <div class="preview-intro">{{ typeIntro }}</div>
             <div class="preview-match">{{ badge }}</div>
             <div class="preview-footer">
               <span>{{ isCN ? '扫码或访问链接查看详情 →' : 'Scan QR or visit link for details →' }}</span>
             </div>
           </div>
         </div>
      </div>

        <div class="share-actions">
          <button class="share-btn primary" @click="exportImage">
            <span class="share-icon">📸</span>
            <span>{{ isCN ? '保存经典海报' : 'Save as Image' }}</span>
          </button>
         <button class="share-btn" @click="copyLink">
           <span class="share-icon">🔗</span>
           <span>{{ isCN ? '复制分享链接' : 'Copy Link' }}</span>
         </button>
       </div>

       <div class="social-share">
         <p class="social-title">{{ isCN ? '分享到' : 'Share to' }}</p>
         <div class="social-grid">
           <button class="social-btn wechat" @click="shareTo('wechat')">
             <span class="social-icon">💬</span>
             <span>{{ isCN ? '微信' : 'WeChat' }}</span>
           </button>
           <button class="social-btn weibo" @click="shareTo('weibo')">
             <span class="social-icon">📢</span>
             <span>{{ isCN ? '微博' : 'Weibo' }}</span>
           </button>
           <button class="social-btn qq" @click="shareTo('qq')">
             <span class="social-icon">🐧</span>
             <span>QQ</span>
           </button>
           <button class="social-btn douban" @click="shareTo('douban')">
             <span class="social-icon">🎬</span>
             <span>{{ isCN ? '豆瓣' : 'Douban' }}</span>
           </button>
           <button class="social-btn tieba" @click="shareTo('tieba')">
             <span class="social-icon">📘</span>
             <span>{{ isCN ? '贴吧' : 'Tieba' }}</span>
           </button>
           <button class="social-btn more" @click="nativeShare">
             <span class="social-icon">⋯</span>
             <span>{{ isCN ? '更多' : 'More' }}</span>
           </button>
         </div>
      </div>

      <transition name="toast">
        <div class="toast" v-if="toastMsg">{{ toastMsg }}</div>
      </transition>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import html2canvas from 'html2canvas'

export default defineComponent({
  name: 'SharePanel',
   props: {
     visible: Boolean,
     version: {
       type: String,
       default: 'en'
     },
     typeCode: String,
     typeLabel: String,
     typeIntro: String,
     badge: String,
     posterUrl: {
       type: String,
       default: ''
     }
   },
   emits: ['close'],
   setup(props) {
     const shareCardRef = ref(null)
     const toastMsg = ref('')
     const posterLoadFailed = ref(false)

     const isCN = computed(() => props.version === 'cn')
     const showPosterImage = computed(() => isCN.value && props.posterUrl && !posterLoadFailed.value)

    watch(
      () => [props.visible, props.posterUrl, props.typeCode, props.version],
      () => {
        posterLoadFailed.value = false
      }
    )

    function getShareUrl() {
      const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
      return `${window.location.origin}${basePath}/${props.version}/share/${props.typeCode}`
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

     async function exportImage() {
       if (!shareCardRef.value) return

        try {
          showToast(isCN.value ? '正在生成图片...' : 'Generating image...')
          const canvas = await html2canvas(shareCardRef.value, {
            scale: 2,
            useCORS: true,
            backgroundColor: isCN.value ? '#f6faf6' : null
          })
        const link = document.createElement('a')
        link.download = `SBTI-${props.typeCode}-${props.typeLabel}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        showToast(isCN.value ? '✅ 图片已保存！' : '✅ Image saved!')
      } catch {
        showToast(isCN.value ? '❌ 导出失败，请重试' : '❌ Export failed. Try again.')
      }
    }

    async function copyLink() {
      const url = getShareUrl()
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

    function shareTo(platform) {
      const url = encodeURIComponent(getShareUrl())
      const title = isCN.value 
        ? encodeURIComponent(`我的SBTI人格是 ${props.typeCode}（${props.typeLabel}）！快来测测你是哪种抽象人格 →`)
        : encodeURIComponent(`My SBTI type is ${props.typeCode} (${props.typeLabel})! Find your vibe →`)
      const summary = encodeURIComponent(props.typeIntro || '')

      const shareUrls = {
        weibo: `https://service.weibo.com/share/share.php?url=${url}&title=${title}`,
        qq: `https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}&summary=${summary}`,
        douban: `https://www.douban.com/share/service?url=${url}&name=${title}`,
        tieba: `http://tieba.baidu.com/f/commit/share/openShareApi?url=${url}&title=${title}`
      }

      if (platform === 'wechat') {
        copyLink()
        showToast(isCN.value ? '💡 微信请复制链接后粘贴发送' : '💡 Copy link and paste to share on WeChat')
        return
      }

      if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=500')
      }
    }

     function nativeShare() {
       if (navigator.share) {
         const title = isCN.value 
          ? `SBTI - ${props.typeCode}（${props.typeLabel}）`
          : `SBTI - ${props.typeCode} (${props.typeLabel})`
         const text = isCN.value
          ? `我的SBTI人格是 ${props.typeCode}（${props.typeLabel}）！${props.typeIntro}`
          : `My SBTI type is ${props.typeCode} (${props.typeLabel})! ${props.typeIntro}`
         navigator.share({
           title,
           text,
           url: getShareUrl()
         }).catch(() => {})
       } else {
         copyLink()
       }
     }

     return {
       copyLink,
       exportImage,
       handlePosterError,
       isCN,
       nativeShare,
       shareCardRef,
       shareTo,
       showPosterImage,
       toastMsg
     }
  }
})
</script>

<style scoped>
.share-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
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

.share-panel-cn {
  max-width: 560px;
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
  width: 32px;
  height: 32px;
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

.preview-bg-cn {
  background:
    radial-gradient(circle at top right, rgba(127, 165, 134, 0.18), rgba(127, 165, 134, 0) 36%),
    linear-gradient(180deg, #ffffff, #f4f8f4);
  border: 1px solid #dbe8dd;
  padding: 18px;
}

.preview-classic-cn {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 16px;
  align-items: stretch;
}

.preview-poster-cn {
  min-height: 360px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image-cn {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-fallback-cn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
}

.preview-info-cn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}

.preview-deco {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(127,165,134,0.2), transparent);
  top: -40px;
  right: -30px;
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

.preview-badge-cn {
  align-self: flex-start;
  color: #4d6a53;
  background: #edf6ef;
  border-color: #dbe8dd;
}

.preview-type {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.02em;
}

.preview-type-cn {
  color: #1e2a22;
  font-size: clamp(34px, 7vw, 48px);
}

.preview-cn {
  font-size: 18px;
  color: #a8d5b0;
  margin-top: 4px;
}

.preview-cn-cn {
  color: #4d6a53;
}

.preview-intro {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  margin-top: 12px;
  line-height: 1.6;
}

.preview-intro-cn {
  color: #6a786f;
  line-height: 1.8;
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

.preview-match-cn {
  align-self: flex-start;
  color: #4d6a53;
  background: #edf6ef;
  border-color: #dbe8dd;
}

.preview-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 12px;
  color: rgba(255,255,255,0.35);
}

.preview-footer-cn {
  border-top-color: #dbe8dd;
  color: #8b9a8e;
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

.share-icon {
  font-size: 18px;
}

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

.social-icon {
  font-size: 22px;
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

@media (max-width: 640px) {
  .preview-classic-cn {
    grid-template-columns: 1fr;
  }

  .preview-poster-cn {
    min-height: 280px;
  }
}

@media (max-width: 480px) {
  .share-panel {
    padding: 20px 16px;
  }

  .social-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 6px;
  }

  .social-btn {
    padding: 10px 2px;
    font-size: 10px;
  }
}
</style>
