<template>
  <div class="result-page" :class="{ 'result-page-cn': isCN }" v-if="result">
    <div class="result-card" :class="{ 'result-card-cn': isCN }">
      <template v-if="isCN">
        <div class="result-layout-cn">
          <div class="result-top-cn">
            <div class="poster-box-cn" :class="{ 'poster-box-cn--fallback': !showPosterImage }">
              <img
                v-if="showPosterImage"
                :src="posterUrl"
                :alt="`${result.finalType.code} 人格海报`"
                class="poster-image-cn"
                @error="handlePosterError"
              />
              <div v-else class="poster-fallback-cn">
                <div class="poster-code-cn">{{ result.finalType.code }}</div>
                <div class="poster-cn-cn">{{ result.finalType.cn }}</div>
                <p>{{ result.finalType.intro }}</p>
              </div>
              <p class="poster-caption-cn">{{ result.finalType.intro }}</p>
            </div>

            <div class="type-box-cn">
              <div class="type-kicker">{{ result.modeKicker }}</div>
              <h1 class="type-name">{{ result.finalType.code }}<span class="type-cn">（{{ result.finalType.cn }}）</span></h1>
              <div class="match-badge match-badge-cn">{{ result.badge }}</div>
              <p class="type-sub type-sub-cn">{{ result.sub }}</p>
            </div>
          </div>

          <div class="section-box analysis section-box-cn">
            <h3>该人格的简单解读</h3>
            <p class="analysis-text">{{ result.finalType.desc }}</p>
          </div>

          <div class="section-box dimensions section-box-cn">
            <h3>十五维度评分</h3>
            <div class="dim-list dim-list-cn">
              <div
                v-for="dim in result.dimDetails"
                :key="dim.dim"
                class="dim-item dim-item-cn"
              >
                <div class="dim-header dim-header-cn">
                  <div class="dim-name">{{ dim.name }}</div>
                  <div class="dim-score dim-score-cn">{{ dim.level }} · {{ dim.score }}分</div>
                </div>
                <p class="dim-explain dim-explain-cn">{{ dim.explanation }}</p>
              </div>
            </div>
          </div>

          <div class="section-box note section-box-cn">
            <h3>友情提示</h3>
            <p>{{ noteText }}</p>
          </div>

          <details class="author-box author-box-cn">
            <summary>作者的话</summary>
           <div class="author-content">
             <template v-if="isCN">
               <p>本测试首发于b站up主蛆肉儿串儿（UID417038183），初衷是劝诫一位爱喝酒的朋友戒酒。</p>
               <p>由于作者的人格是SHIT愤世者，所以平等的攻击了各位，在此抱歉！！不过我是一个绝世大美女，你们一定会原谅我，有B站的朋友们也可以关注我。</p>
               <p>关于这个测试，我没法很好的平衡娱乐和专业性，因此对于一些人格的阐释较为模糊或完全不准（如屌丝可能并非真的屌丝），如有冒犯非常抱歉！！</p>
               <p>再鉴于时间精力有限，就随便搞了一个先这样玩玩，后续会慢慢完善修改的，总之好玩为主，还请不要用于盈利呀。</p>
             </template>
             <template v-else>
               <p>This test was originally created by Bilibili creator <a href="https://space.bilibili.com/417038183" target="_blank" rel="noreferrer">@蛆肉儿串er</a> (UID: 417038183). It started as a joke to convince a friend to stop drinking.</p>
               <p>The creator is type SHIT - so everyone gets roasted equally. Sorry for the chaos! But she's actually a gorgeous legend, so you'll forgive her.</p>
               <p>It's impossible to balance chaos and accuracy - some types might not vibe with you. If you're offended, sorry! That's just how it goes.</p>
               <p>It was thrown together in limited time, so it's what it is. The main goal is to have fun. Please don't use this for commercial purposes.</p>
             </template>
           </div>
          </details>

          <div class="result-actions result-actions-cn">
            <div class="actions-left">
              <button class="btn-outline btn-outline-cn" @click="goHome">回到首页</button>
              <button class="btn-outline btn-outline-cn" @click="restart">重新测试</button>
            </div>
            <button class="btn-share btn-share-cn" @click="showShare = true">分享结果</button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="result-hero">
          <div class="type-section">
            <div class="type-kicker">{{ result.modeKicker }}</div>
            <h1 class="type-name">{{ result.finalType.code }}<span class="type-cn">（{{ result.finalType.cn }}）</span></h1>
            <div class="match-badge">{{ result.badge }}</div>
            <p class="type-sub">{{ result.sub }}</p>
          </div>
          <div class="poster-section">
            <div class="poster-card">
              <div class="poster-emoji">{{ getTypeEmoji(result.finalType.code) }}</div>
              <p class="poster-intro">{{ result.finalType.intro }}</p>
            </div>
          </div>
        </div>

         <div class="section-box analysis">
           <h3>📖 {{ isCN ? '该人格的简单解读' : 'Type Breakdown' }}</h3>
           <p class="analysis-text">{{ result.finalType.desc }}</p>
         </div>

         <div class="section-box dimensions">
           <h3>📊 {{ isCN ? '十五维度评分' : '15-Dimension Score' }}</h3>
          <div class="dim-list">
            <div
              v-for="dim in result.dimDetails"
              :key="dim.dim"
              class="dim-item"
            >
              <div class="dim-header">
                <div class="dim-name">{{ dim.name }}</div>
                <div class="dim-meta">
                  <span class="dim-model">{{ dim.model }}</span>
                  <span class="dim-score" :class="'level-' + dim.level.toLowerCase()">
                    {{ dim.level }} · {{ dim.score }}分
                  </span>
                </div>
              </div>
              <div class="dim-bar">
                <div class="dim-bar-fill" :class="'level-' + dim.level.toLowerCase()" :style="{ width: (dim.score / 6 * 100) + '%' }"></div>
              </div>
              <p class="dim-explain">{{ dim.explanation }}</p>
            </div>
          </div>
        </div>

         <div class="section-box top3">
           <h3>🏆 {{ isCN ? '其他高匹配人格' : 'Top Similar Types' }}</h3>
           <div class="top3-list">
             <div
               v-for="(t, i) in result.ranked.slice(1, 4)"
               :key="t.code"
               class="top3-item"
             >
               <div class="top3-info">
                 <span class="top3-rank">#{{ i + 2 }}</span>
                 <strong>{{ t.code }} ({{ isCN ? t.cn : t.en }})</strong>
               </div>
               <span class="top3-score">{{ t.similarity }}%</span>
             </div>
           </div>
         </div>

         <div class="section-box note">
           <h3>⚠️ {{ isCN ? '友情提示' : 'Disclaimer' }}</h3>
           <p>{{ noteText }}</p>
         </div>

         <details class="author-box">
           <summary>✍️ {{ isCN ? '作者的话' : 'Author Notes' }}</summary>
          <div class="author-content">
            <p>本测试首发于b站up主蛆肉儿串儿（UID417038183），初衷是劝诫一位爱喝酒的朋友戒酒。</p>
            <p>由于作者的人格是SHIT愤世者，所以平等的攻击了各位，在此抱歉！！不过我是一个绝世大美女，你们一定会原谅我，有B站的朋友们也可以关注我。</p>
            <p>关于这个测试，我没法很好的平衡娱乐和专业性，因此对于一些人格的阐释较为模糊或完全不准（如屌丝可能并非真的屌丝），如有冒犯非常抱歉！！</p>
            <p>再鉴于时间精力有限，就随便搞了一个先这样玩玩，后续会慢慢完善修改的，总之好玩为主，还请不要用于盈利呀。</p>
          </div>
        </details>

         <div class="result-actions">
           <div class="actions-left">
             <button class="btn-outline" @click="goHome">🏠 {{ isCN ? '首页' : 'Home' }}</button>
             <button class="btn-outline" @click="restart">🔄 {{ isCN ? '重新测试' : 'Retake' }}</button>
           </div>
           <button class="btn-share" @click="showShare = true">🚀 {{ isCN ? '分享结果' : 'Share Results' }}</button>
         </div>
      </template>
    </div>

    <SharePanel
      :visible="showShare"
      :version="currentVersion"
      :typeCode="result.finalType.code"
      :typeCn="result.finalType.cn"
      :typeIntro="result.finalType.intro"
      :badge="result.badge"
      :posterUrl="isCN ? posterUrl : ''"
      @close="showShare = false"
    />
  </div>

  <div class="no-result" v-else>
    <p>暂无测试结果</p>
    <button class="btn-primary" @click="goHome">去测试</button>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SharePanel from '../components/SharePanel.vue'
import { getClassicV1PosterUrl } from '../composables/useTypePoster.js'

export default defineComponent({
  name: 'ResultView',
  components: {
    SharePanel
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const result = ref(null)
    const showShare = ref(false)
    const posterLoadFailed = ref(false)

    const currentVersion = computed(() => route.params.version === 'cn' ? 'cn' : 'en')
    const isCN = computed(() => currentVersion.value === 'cn')
    const posterUrl = computed(() => (isCN.value && result.value ? getClassicV1PosterUrl(result.value.finalType.code) : ''))
    const showPosterImage = computed(() => Boolean(isCN.value && posterUrl.value && !posterLoadFailed.value))
     const noteText = computed(() => {
       if (isCN.value) {
         return result.value?.special
           ? '本测试仅供娱乐。隐藏人格和傻乐兜底都属于作者故意埋的损招，请勿把它当成医学、心理学、相学、命理学或灵异学依据。'
           : '本测试仅供娱乐，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。你可以笑，但别太当真。'
       } else {
         return result.value?.special
           ? 'This test is just for fun. Secret types and jokes are intentional. Don\'t take this as medical, psychological, or spiritual advice.'
           : 'This test is just for fun. Don\'t use it for real life decisions. Enjoy the chaos.'
       }
     })

    onMounted(() => {
      const stored = sessionStorage.getItem('sbti_result')
      if (stored) {
        result.value = JSON.parse(stored)
        posterLoadFailed.value = false
      }
    })

    function handlePosterError() {
      posterLoadFailed.value = true
    }

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

    function goHome() {
      router.push(`/${currentVersion.value}`)
    }

    function restart() {
      sessionStorage.removeItem('sbti_result')
      router.push(`/${currentVersion.value}/test`)
    }

    return {
      currentVersion,
      getTypeEmoji,
      goHome,
      handlePosterError,
      isCN,
      noteText,
      posterUrl,
      restart,
      result,
      showPosterImage,
      showShare
    }
  }
})
</script>

<style scoped>
.result-page {
  --result-line: #e8f0ea;
  --result-soft: #edf6ef;
  --result-accent: #5b8a63;
  --result-accent-strong: #4d6a53;
  --result-text: #1e2a22;
  --result-muted: #6a786f;
  min-height: 100vh;
  padding: 16px 16px 80px;
  max-width: 720px;
  margin: 0 auto;
}

.result-page-cn {
  max-width: 980px;
}

.result-card {
  background: #fff;
  border-radius: 24px;
  border: 1px solid var(--result-line);
  box-shadow: 0 8px 32px rgba(47, 73, 55, 0.06);
  padding: 28px;
  margin-top: 12px;
}

.result-card-cn {
  box-shadow: 0 16px 40px rgba(47, 73, 55, 0.08);
}

.result-layout-cn {
  display: grid;
  gap: 18px;
}

.result-top-cn {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 18px;
  align-items: stretch;
}

.poster-box-cn,
.type-box-cn,
.section-box-cn,
.author-box-cn {
  border: 1px solid var(--result-line);
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff, #fbfdfb);
}

.poster-box-cn {
  display: grid;
  grid-template-rows: minmax(320px, 1fr) auto;
  padding: 16px;
  background:
    radial-gradient(circle at top right, rgba(127, 165, 134, 0.16), rgba(127, 165, 134, 0) 38%),
    linear-gradient(180deg, #ffffff, #f7fbf8);
  overflow: hidden;
  position: relative;
}

.poster-box-cn::after {
  content: '';
  position: absolute;
  right: -44px;
  bottom: -44px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(127, 165, 134, 0.12), rgba(127, 165, 134, 0.01));
}

.poster-image-cn {
  width: 100%;
  height: 100%;
  max-height: 520px;
  object-fit: contain;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  position: relative;
  z-index: 1;
}

.poster-fallback-cn {
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 30px 24px;
  position: relative;
  z-index: 1;
}

.poster-code-cn {
  font-size: clamp(48px, 10vw, 72px);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.05em;
  color: var(--result-text);
}

.poster-cn-cn {
  margin-top: 10px;
  font-size: 22px;
  font-weight: 700;
  color: var(--result-accent-strong);
}

.poster-fallback-cn p,
.poster-caption-cn {
  color: var(--result-muted);
  font-size: 14px;
  line-height: 1.8;
}

.poster-fallback-cn p {
  margin: 14px 0 0;
}

.poster-caption-cn {
  margin-top: 14px;
  position: relative;
  z-index: 1;
}

.type-box-cn {
  padding: 18px;
}

.result-hero {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;
  margin-bottom: 24px;
}

.type-kicker {
  font-size: 12px;
  color: var(--result-accent);
  font-weight: 700;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}

.type-name {
  font-size: clamp(28px, 6vw, 42px);
  font-weight: 900;
  color: var(--result-text);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0;
}

.type-cn {
  font-size: 0.55em;
  font-weight: 600;
  color: var(--result-muted);
}

.match-badge {
  display: inline-flex;
  align-items: center;
  margin-top: 14px;
  padding: 8px 14px;
  background: linear-gradient(135deg, #edf6ef, #e0f0e3);
  border: 1px solid #c4dfc8;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  color: var(--result-accent-strong);
}

.match-badge-cn {
  font-size: 14px;
  line-height: 1.5;
}

.type-sub {
  margin-top: 12px;
  font-size: 14px;
  color: var(--result-muted);
  line-height: 1.7;
}

.type-sub-cn {
  line-height: 1.8;
}

.poster-section {
  display: flex;
  align-items: center;
}

.poster-card {
  width: 100%;
  background: linear-gradient(135deg, #1a2e23, #2d4a3a);
  border-radius: 20px;
  padding: 32px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.poster-card::after {
  content: '';
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(127,165,134,0.2), transparent);
  top: -30px;
  right: -20px;
}

.poster-emoji {
  font-size: 56px;
  margin-bottom: 12px;
  position: relative;
}

.poster-intro {
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
  position: relative;
}

.section-box {
  border: 1px solid var(--result-line);
  border-radius: 18px;
  padding: 20px;
  background: linear-gradient(180deg, #fff, #fcfdfb);
  margin-bottom: 16px;
}

.section-box-cn {
  margin-bottom: 0;
}

.section-box h3,
.section-box-cn h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--result-text);
  margin: 0 0 14px;
}

.analysis-text {
  color: #304034;
  font-size: 15px;
  line-height: 1.9;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

.dim-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.dim-list-cn {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.dim-item {
  padding: 14px;
  background: #fff;
  border: 1px solid #edf3ee;
  border-radius: 14px;
}

.dim-item-cn {
  padding: 14px 16px;
}

.dim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 6px;
}

.dim-header-cn {
  align-items: baseline;
}

.dim-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--result-text);
}

.dim-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dim-model {
  font-size: 11px;
  color: #9aaa9f;
  background: #f6faf6;
  padding: 2px 8px;
  border-radius: 6px;
}

.dim-score {
  font-size: 13px;
  font-weight: 800;
}

.dim-score-cn {
  color: var(--result-accent-strong);
}

.dim-score.level-l { color: #d4a574; }
.dim-score.level-m { color: #7fa586; }
.dim-score.level-h { color: #4d6a53; }

.dim-bar {
  height: 6px;
  background: #edf3ee;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 8px;
}

.dim-bar-fill {
  height: 100%;
  border-radius: inherit;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.dim-bar-fill.level-l { background: linear-gradient(90deg, #e8c9a0, #d4a574); }
.dim-bar-fill.level-m { background: linear-gradient(90deg, #a8d5b0, #7fa586); }
.dim-bar-fill.level-h { background: linear-gradient(90deg, #7fa586, #4d6a53); }

.dim-explain {
  margin: 0;
  font-size: 13px;
  color: var(--result-muted);
  line-height: 1.7;
}

.dim-explain-cn {
  line-height: 1.8;
}

.top3-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top3-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid #edf3ee;
  border-radius: 12px;
}

.top3-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top3-rank {
  font-size: 13px;
  font-weight: 800;
  color: #9aaa9f;
}

.top3-item strong {
  font-size: 14px;
  color: var(--result-text);
}

.top3-score {
  font-size: 15px;
  font-weight: 800;
  color: var(--result-accent-strong);
}

.note p {
  margin: 0;
  font-size: 13px;
  color: var(--result-muted);
  line-height: 1.8;
}

.author-box {
  border: 1px solid var(--result-line);
  border-radius: 18px;
  background: #fff;
  overflow: hidden;
  margin-bottom: 16px;
}

.author-box-cn {
  margin-bottom: 0;
}

.author-box summary {
  list-style: none;
  cursor: pointer;
  padding: 18px 20px;
  font-size: 16px;
  font-weight: 700;
  color: var(--result-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.author-box summary::-webkit-details-marker {
  display: none;
}

.author-content {
  border-top: 1px solid var(--result-line);
  padding: 0 20px 18px;
}

.author-content p {
  margin: 12px 0 0;
  font-size: 14px;
  color: #304034;
  line-height: 1.9;
}

.result-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.result-actions-cn {
  margin-top: 0;
}

.actions-left {
  display: flex;
  gap: 10px;
}

.btn-outline {
  padding: 12px 20px;
  border-radius: 12px;
  border: 1.5px solid var(--result-line);
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  color: var(--result-accent-strong);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  border-color: #7fa586;
  background: #f6faf6;
}

.btn-outline-cn,
.btn-share-cn {
  min-height: 44px;
}

.btn-share {
  padding: 14px 28px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #5b8a63, #7fa586);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(91,138,99,0.3);
  transition: all 0.3s;
}

.btn-share:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(91,138,99,0.4);
}

.no-result {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: var(--result-muted);
}

.btn-primary {
  padding: 14px 28px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #5b8a63, #7fa586);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 860px) {
  .result-top-cn {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .result-hero {
    grid-template-columns: 1fr;
  }

  .result-card {
    padding: 20px 16px;
  }

  .actions-left {
    flex-direction: column;
    width: 100%;
  }

  .result-actions {
    flex-direction: column;
  }

  .btn-share {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .dim-list-cn {
    grid-template-columns: 1fr;
  }

  .poster-box-cn {
    grid-template-rows: minmax(240px, 1fr) auto;
    padding: 14px;
  }
}
</style>
