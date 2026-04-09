<template>
  <div class="result-page" v-if="result">
    <div class="result-card">
      <!-- 顶部结果展示 -->
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

      <!-- 人格解读 -->
      <div class="section-box analysis">
        <h3>📖 该人格的简单解读</h3>
        <p class="analysis-text">{{ result.finalType.desc }}</p>
      </div>

      <!-- 十五维度评分 -->
      <div class="section-box dimensions">
        <h3>📊 十五维度评分</h3>
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

      <!-- TOP3 匹配 -->
      <div class="section-box top3">
        <h3>🏆 其他高匹配人格</h3>
        <div class="top3-list">
          <div
            v-for="(t, i) in result.ranked.slice(1, 4)"
            :key="t.code"
            class="top3-item"
          >
            <div class="top3-info">
              <span class="top3-rank">#{{ i + 2 }}</span>
              <strong>{{ t.code }}（{{ t.cn }}）</strong>
            </div>
            <span class="top3-score">{{ t.similarity }}%</span>
          </div>
        </div>
      </div>

      <!-- 友情提示 -->
      <div class="section-box note">
        <h3>⚠️ 友情提示</h3>
        <p>{{ result.special
          ? '本测试仅供娱乐。隐藏人格和傻乐兜底都属于作者故意埋的损招，请勿把它当成医学、心理学、相学、命理学或灵异学依据。'
          : '本测试仅供娱乐，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。你可以笑，但别太当真。'
        }}</p>
      </div>

      <!-- 作者的话 -->
      <details class="author-box">
        <summary>✍️ 作者的话</summary>
        <div class="author-content">
          <p>本测试首发于b站up主蛆肉儿串儿（UID417038183），初衷是劝诫一位爱喝酒的朋友戒酒。</p>
          <p>由于作者的人格是SHIT愤世者，所以平等的攻击了各位，在此抱歉！！不过我是一个绝世大美女，你们一定会原谅我，有B站的朋友们也可以关注我。</p>
          <p>关于这个测试，我没法很好的平衡娱乐和专业性，因此对于一些人格的阐释较为模糊或完全不准（如屌丝可能并非真的屌丝），如有冒犯非常抱歉！！</p>
          <p>再鉴于时间精力有限，就随便搞了一个先这样玩玩，后续会慢慢完善修改的，总之好玩为主，还请不要用于盈利呀。</p>
        </div>
      </details>

      <!-- 操作按钮 -->
      <div class="result-actions">
        <div class="actions-left">
          <button class="btn-outline" @click="goHome">🏠 首页</button>
          <button class="btn-outline" @click="restart">🔄 重新测试</button>
        </div>
        <button class="btn-share" @click="showShare = true">
          🚀 分享结果
        </button>
      </div>
    </div>

    <!-- 分享面板 -->
    <SharePanel
      :visible="showShare"
      :typeCode="result.finalType.code"
      :typeCn="result.finalType.cn"
      :typeIntro="result.finalType.intro"
      :badge="result.badge"
      @close="showShare = false"
    />
  </div>

  <!-- 无结果时跳转首页 -->
  <div class="no-result" v-else>
    <p>暂无测试结果</p>
    <button class="btn-primary" @click="goHome">去测试</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SharePanel from '../components/SharePanel.vue'

const router = useRouter()
const result = ref(null)
const showShare = ref(false)

onMounted(() => {
  const stored = sessionStorage.getItem('sbti_result')
  if (stored) {
    result.value = JSON.parse(stored)
  }
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

function goHome() {
  router.push('/')
}

function restart() {
  sessionStorage.removeItem('sbti_result')
  router.push('/test')
}
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  padding: 16px 16px 80px;
  max-width: 720px;
  margin: 0 auto;
}

.result-card {
  background: #fff;
  border-radius: 24px;
  border: 1px solid #e8f0ea;
  box-shadow: 0 8px 32px rgba(47, 73, 55, 0.06);
  padding: 28px;
  margin-top: 12px;
}

.result-hero {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;
  margin-bottom: 24px;
}

.type-kicker {
  font-size: 12px;
  color: #5b8a63;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}

.type-name {
  font-size: clamp(28px, 6vw, 42px);
  font-weight: 900;
  color: #1e2a22;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0;
}

.type-cn {
  font-size: 0.55em;
  font-weight: 600;
  color: #6a786f;
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
  color: #4d6a53;
}

.type-sub {
  margin-top: 12px;
  font-size: 14px;
  color: #6a786f;
  line-height: 1.7;
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
  width: 120px; height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(127,165,134,0.2), transparent);
  top: -30px; right: -20px;
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
  border: 1px solid #e8f0ea;
  border-radius: 18px;
  padding: 20px;
  background: linear-gradient(180deg, #fff, #fcfdfb);
  margin-bottom: 16px;
}

.section-box h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1e2a22;
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

.dim-item {
  padding: 14px;
  background: #fff;
  border: 1px solid #edf3ee;
  border-radius: 14px;
}

.dim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 6px;
}

.dim-name {
  font-size: 14px;
  font-weight: 700;
  color: #1e2a22;
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
  color: #6a786f;
  line-height: 1.7;
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
  color: #1e2a22;
}

.top3-score {
  font-size: 15px;
  font-weight: 800;
  color: #4d6a53;
}

.note p {
  margin: 0;
  font-size: 13px;
  color: #6a786f;
  line-height: 1.8;
}

.author-box {
  border: 1px solid #e8f0ea;
  border-radius: 18px;
  background: #fff;
  overflow: hidden;
  margin-bottom: 16px;
}

.author-box summary {
  list-style: none;
  cursor: pointer;
  padding: 18px 20px;
  font-size: 16px;
  font-weight: 700;
  color: #1e2a22;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.author-box summary::-webkit-details-marker { display: none; }

.author-content {
  border-top: 1px solid #e8f0ea;
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

.actions-left {
  display: flex;
  gap: 10px;
}

.btn-outline {
  padding: 12px 20px;
  border-radius: 12px;
  border: 1.5px solid #e8f0ea;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  color: #4d6a53;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  border-color: #7fa586;
  background: #f6faf6;
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
  color: #6a786f;
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

@media (max-width: 700px) {
  .result-hero { grid-template-columns: 1fr; }
  .result-card { padding: 20px 16px; }
  .actions-left { flex-direction: column; width: 100%; }
  .result-actions { flex-direction: column; }
  .btn-share { width: 100%; text-align: center; }
}
</style>
