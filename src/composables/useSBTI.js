import { ref, computed } from 'vue'
import {
  questions, specialQuestions, TYPE_LIBRARY, NORMAL_TYPES,
  dimensionMeta, dimensionOrder, DIM_EXPLANATIONS
} from '../data/sbtiData.js'

const answers = ref({})
const shuffledQuestions = ref([])

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function getVisibleQuestions() {
  const visible = [...shuffledQuestions.value]
  const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1')
  if (gateIndex !== -1 && answers.value['drink_gate_q1'] === 3) {
    visible.splice(gateIndex + 1, 0, specialQuestions[1])
  }
  return visible
}

function sumToLevel(score) {
  if (score <= 3) return 'L'
  if (score === 4) return 'M'
  return 'H'
}

function levelNum(level) {
  return { L: 1, M: 2, H: 3 }[level]
}

function parsePattern(pattern) {
  return pattern.replace(/-/g, '').split('')
}

export function useSBTI() {
  const progress = computed(() => {
    const visible = getVisibleQuestions()
    const total = visible.length
    const done = visible.filter(q => answers.value[q.id] !== undefined).length
    return { done, total, percent: total ? (done / total) * 100 : 0 }
  })

  const isComplete = computed(() => {
    const { done, total } = progress.value
    return done === total && total > 0
  })

  function startTest() {
    answers.value = {}
    const shuffled = shuffle(questions)
    const insertIndex = Math.floor(Math.random() * shuffled.length) + 1
    shuffledQuestions.value = [
      ...shuffled.slice(0, insertIndex),
      specialQuestions[0],
      ...shuffled.slice(insertIndex)
    ]
  }

  function setAnswer(questionId, value) {
    answers.value[questionId] = value
    if (questionId === 'drink_gate_q1' && value !== 3) {
      delete answers.value['drink_gate_q2']
    }
  }

  function computeResult() {
    const rawScores = {}
    const levels = {}
    Object.keys(dimensionMeta).forEach(dim => { rawScores[dim] = 0 })

    questions.forEach(q => {
      rawScores[q.dim] += Number(answers.value[q.id] || 0)
    })

    Object.entries(rawScores).forEach(([dim, score]) => {
      levels[dim] = sumToLevel(score)
    })

    const userVector = dimensionOrder.map(dim => levelNum(levels[dim]))
    const ranked = NORMAL_TYPES.map(type => {
      const vector = parsePattern(type.pattern).map(levelNum)
      let distance = 0
      let exact = 0
      for (let i = 0; i < vector.length; i++) {
        const diff = Math.abs(userVector[i] - vector[i])
        distance += diff
        if (diff === 0) exact += 1
      }
      const similarity = Math.max(0, Math.round((1 - distance / 30) * 100))
      return { ...type, ...TYPE_LIBRARY[type.code], distance, exact, similarity }
    }).sort((a, b) => {
      if (a.distance !== b.distance) return a.distance - b.distance
      if (b.exact !== a.exact) return b.exact - a.exact
      return b.similarity - a.similarity
    })

    const bestNormal = ranked[0]
    const drunkTriggered = answers.value['drink_gate_q2'] === 2

    let finalType, modeKicker, badge, sub, special = false, secondaryType = null

    if (drunkTriggered) {
      finalType = TYPE_LIBRARY.DRUNK
      secondaryType = bestNormal
      modeKicker = '隐藏人格已激活'
      badge = '匹配度 100% · 酒精异常因子已接管'
      sub = '乙醇亲和性过强，系统已直接跳过常规人格审判。'
      special = true
    } else if (bestNormal.similarity < 60) {
      finalType = TYPE_LIBRARY.HHHH
      modeKicker = '系统强制兜底'
      badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`
      sub = '标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。'
      special = true
    } else {
      finalType = bestNormal
      modeKicker = '你的主类型'
      badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`
      sub = '维度命中度较高，当前结果可视为你的第一人格画像。'
    }

    const dimDetails = dimensionOrder.map(dim => ({
      dim,
      name: dimensionMeta[dim].name,
      model: dimensionMeta[dim].model,
      level: levels[dim],
      score: rawScores[dim],
      explanation: DIM_EXPLANATIONS[dim][levels[dim]]
    }))

    return {
      rawScores, levels, ranked, bestNormal,
      finalType, modeKicker, badge, sub, special,
      secondaryType, dimDetails
    }
  }

  return {
    answers,
    shuffledQuestions,
    getVisibleQuestions,
    progress,
    isComplete,
    startTest,
    setAnswer,
    computeResult
  }
}
