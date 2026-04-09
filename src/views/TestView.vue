<template>
  <div class="test-page">
    <div class="test-card">
      <!-- 顶部进度条 -->
      <div class="topbar">
        <div class="progress-wrap">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress.percent + '%' }"></div>
          </div>
          <span class="progress-text">{{ progress.done }} / {{ progress.total }}</span>
        </div>
        <button class="btn-back" @click="goHome">← 返回</button>
      </div>

      <!-- 提示语 -->
      <div class="hint-bar" :class="{ complete: isComplete }">
        <span v-if="isComplete">✨ 都做完了。现在可以把你的电子魂魄交给结果页审判。</span>
        <span v-else>💡 全选完才会放行。世界已经够乱了，起码把题做完整。</span>
      </div>

      <!-- 题目列表 -->
      <div class="question-list">
        <div
          v-for="(q, index) in visibleQuestions"
          :key="q.id"
          class="question-card"
          :class="{ answered: answers[q.id] !== undefined }"
        >
          <div class="question-meta">
            <span class="q-badge">第 {{ index + 1 }} 题</span>
            <span class="q-dim">{{ q.special ? '补充题' : '维度已隐藏' }}</span>
          </div>
          <div class="question-text">{{ q.text }}</div>
          <div class="options">
            <label
              v-for="(opt, oi) in q.options"
              :key="oi"
              class="option"
              :class="{ selected: answers[q.id] === opt.value }"
            >
              <input
                type="radio"
                :name="q.id"
                :value="opt.value"
                :checked="answers[q.id] === opt.value"
                @change="onSelect(q.id, opt.value)"
              />
              <span class="option-radio">
                <span class="radio-inner" v-if="answers[q.id] === opt.value"></span>
              </span>
              <span class="option-code">{{ ['A','B','C','D'][oi] }}</span>
              <span class="option-label">{{ opt.label }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="actions-bottom">
        <button class="btn-submit" :disabled="!isComplete" @click="submitResult">
          <span v-if="isComplete">提交并查看结果 →</span>
          <span v-else>还有 {{ progress.total - progress.done }} 题未完成</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSBTI } from '../composables/useSBTI.js'

const router = useRouter()
const { answers, shuffledQuestions, getVisibleQuestions, progress, isComplete, startTest, setAnswer, computeResult } = useSBTI()

const visibleQuestions = computed(() => getVisibleQuestions())

onMounted(() => {
  startTest()
})

function onSelect(questionId, value) {
  setAnswer(questionId, value)
}

function submitResult() {
  const result = computeResult()
  // 将结果存入 sessionStorage 以便结果页使用
  sessionStorage.setItem('sbti_result', JSON.stringify(result))
  router.push('/result')
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.test-page {
  min-height: 100vh;
  padding: 16px 16px 60px;
  max-width: 720px;
  margin: 0 auto;
}

.test-card {
  background: #fff;
  border-radius: 24px;
  border: 1px solid #e8f0ea;
  box-shadow: 0 8px 32px rgba(47, 73, 55, 0.06);
  padding: 24px;
  margin-top: 12px;
}

.topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.progress-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #edf3ee;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #7fa586, #4d6a53);
  border-radius: inherit;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-text {
  font-size: 13px;
  color: #6a786f;
  font-weight: 600;
  white-space: nowrap;
  min-width: 48px;
  text-align: right;
}

.btn-back {
  background: none;
  border: 1px solid #dbe8dd;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 13px;
  color: #6a786f;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-back:hover {
  background: #f6faf6;
  border-color: #7fa586;
  color: #4d6a53;
}

.hint-bar {
  padding: 12px 16px;
  background: #f8fcf9;
  border: 1px solid #e8f0ea;
  border-radius: 12px;
  font-size: 13px;
  color: #6a786f;
  line-height: 1.6;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.hint-bar.complete {
  background: linear-gradient(135deg, #edf6ef, #e0f0e3);
  border-color: #a8d5b0;
  color: #4d6a53;
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-card {
  border: 1px solid #e8f0ea;
  border-radius: 18px;
  padding: 20px;
  background: linear-gradient(180deg, #fff, #fcfdfb);
  transition: all 0.3s;
}

.question-card.answered {
  border-color: #c4dfc8;
  background: linear-gradient(180deg, #fff, #f6faf6);
}

.question-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.q-badge {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  color: #4d6a53;
  background: #edf6ef;
  border: 1px solid #dbe8dd;
  border-radius: 999px;
  padding: 4px 12px;
}

.q-dim {
  font-size: 11px;
  color: #9aaa9f;
}

.question-text {
  font-size: 15px;
  line-height: 1.8;
  color: #1e2a22;
  white-space: pre-wrap;
  word-break: break-word;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
}

.option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1.5px solid #e8f0ea;
  background: #fff;
  cursor: pointer;
  transition: all 0.25s;
  user-select: none;
}

.option:hover {
  border-color: #b8d4bc;
  background: #f8fcf9;
}

.option.selected {
  border-color: #7fa586;
  background: linear-gradient(135deg, #f0f7f1, #e6f2e8);
  box-shadow: 0 2px 8px rgba(127, 165, 134, 0.15);
}

.option input[type="radio"] {
  display: none;
}

.option-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #c4d8c8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  transition: all 0.2s;
}

.option.selected .option-radio {
  border-color: #5b8a63;
}

.radio-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5b8a63, #7fa586);
  animation: popIn 0.2s ease;
}

@keyframes popIn {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

.option-code {
  font-weight: 800;
  font-size: 14px;
  color: #4d6a53;
  min-width: 20px;
  flex-shrink: 0;
}

.option-label {
  font-size: 14px;
  line-height: 1.7;
  color: #304034;
}

.actions-bottom {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.btn-submit {
  padding: 16px 40px;
  border-radius: 16px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  background: linear-gradient(135deg, #5b8a63, #7fa586);
  color: #fff;
  box-shadow: 0 8px 24px rgba(91, 138, 99, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(91, 138, 99, 0.4);
}

.btn-submit:disabled {
  background: #c4d8c8;
  color: #fff;
  cursor: not-allowed;
  box-shadow: none;
}

@media (max-width: 600px) {
  .test-card { padding: 16px; }
  .question-card { padding: 16px; }
  .option { padding: 12px 14px; }
}
</style>
