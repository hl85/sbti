import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/en',
    meta: {
      titleZh: 'SBTI 人格测试',
      titleEn: 'SBTI Personality Test',
      descriptionZh: 'SBTI（Silly Big Personality Test）- 31道灵魂拷问，26种抽象人格，测试仅供娱乐。',
      descriptionEn: 'SBTI (Silly Big Personality Test): 31 chaotic questions and 26 meme personality types. Just for fun.'
    }
  },
  {
    path: '/what-is-sbti',
    name: 'WhatIsSbti',
    component: () => import('../views/WhatIsSbtiView.vue'),
    meta: {
      titleZh: 'What is SBTI？| SBTI 人格测试',
      titleEn: 'What is SBTI? | SBTI Personality Test',
      descriptionZh: 'SBTI 是什么？这里汇总其起源、传播背景、公开报道与截图参考，中英文同页切换。',
      descriptionEn: 'What is SBTI? A bilingual explainer with origin, spread context, public references, and screenshots.'
    }
  },
  {
    path: '/:version',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      titleZh: 'SBTI 人格测试 - 首页',
      titleEn: 'SBTI Personality Test - Home',
      descriptionZh: 'MBTI已经过时，SBTI来了。31道题、26种抽象人格、15维度结果。',
      descriptionEn: 'MBTI is dead, SBTI just dropped. 31 questions, 26 chaotic types, 15 dimensions.'
    }
  },
  {
    path: '/:version/what-is-sbti',
    redirect: '/what-is-sbti'
  },
  {
    path: '/:version/test',
    name: 'Test',
    component: () => import('../views/TestView.vue'),
    meta: {
      titleZh: 'SBTI 人格测试 - 开始测试',
      titleEn: 'SBTI Personality Test - Take the Test',
      descriptionZh: '进入 SBTI 测试：31 道题，几分钟完成，生成人格结果。',
      descriptionEn: 'Take the SBTI test: 31 fast questions and shareable result types.'
    }
  },
  {
    path: '/:version/result',
    name: 'Result',
    component: () => import('../views/ResultView.vue'),
    meta: {
      titleZh: 'SBTI 人格测试 - 测试结果',
      titleEn: 'SBTI Personality Test - Result',
      descriptionZh: '查看你的 SBTI 人格结果、匹配度与十五维度评分。',
      descriptionEn: 'View your SBTI type, match score, and 15-dimension breakdown.'
    }
  },
  {
    path: '/:version/share/:type',
    name: 'Share',
    component: () => import('../views/ShareView.vue'),
    meta: {
      titleZh: 'SBTI 人格测试 - 分享页',
      titleEn: 'SBTI Personality Test - Share',
      descriptionZh: '分享你的 SBTI 人格类型结果。',
      descriptionEn: 'Share your SBTI personality result card.'
    }
  },
  {
    path: '/:version/gallery',
    name: 'Gallery',
    component: () => import('../views/GalleryView.vue'),
    meta: {
      titleZh: 'SBTI 人格测试 - 人格图鉴',
      titleEn: 'SBTI Personality Test - Type Gallery',
      descriptionZh: '查看全部 SBTI 人格类型图鉴与文案。',
      descriptionEn: 'Browse the full SBTI type gallery and descriptions.'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation guard to ensure valid version
router.beforeEach((to, from, next) => {
  const version = to.params.version
  if (to.path !== '/' && version !== undefined) {
    // Legacy redirects for v1/v2 to cn/en
    if (version === 'v1') {
      const restPath = to.path.replace(/^\/[^/]+/, '')
      next(`/cn${restPath || ''}`)
      return
    }
    if (version === 'v2') {
      const restPath = to.path.replace(/^\/[^/]+/, '')
      next(`/en${restPath || ''}`)
      return
    }
    // Check for valid new versions
    if (version !== 'cn' && version !== 'en') {
      // If version is invalid, default to en but keep the rest of the path
      const restPath = to.path.replace(/^\/[^/]+/, '')
      next(`/en${restPath || ''}`)
      return
    }
  }
  next()
})

function upsertMeta(selector, attrs) {
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    document.head.appendChild(tag)
  }
  Object.entries(attrs).forEach(([key, value]) => {
    tag.setAttribute(key, value)
  })
}

function upsertLink(selector, attrs) {
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement('link')
    document.head.appendChild(tag)
  }
  Object.entries(attrs).forEach(([key, value]) => {
    tag.setAttribute(key, value)
  })
}

router.afterEach((to) => {
  if (typeof window === 'undefined') return

  const isEn = to.params.version === 'en'
  const title = isEn
    ? (to.meta.titleEn || 'SBTI Personality Test')
    : (to.meta.titleZh || 'SBTI 人格测试')
  const description = isEn
    ? (to.meta.descriptionEn || 'SBTI (Silly Big Personality Test): meme-style personality test for fun.')
    : (to.meta.descriptionZh || 'SBTI（Silly Big Personality Test）是一款娱乐向人格测试。')
  const keywords = isEn
    ? 'sbti personality test,sbti test,mbti personality,mbti test,sbti mbti,personality type,personality quiz'
    : 'sbti 人格 测试,人格 测试,人格 測試,mbti 人格,sbti mbti,mbti,mbti 测试,mbti 人格 测试,sbti test,人格 类型'

  document.title = title
  document.documentElement.lang = isEn ? 'en' : 'zh-CN'

  upsertMeta('meta[name="description"]', { name: 'description', content: description })
  upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords })
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
  upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: isEn ? 'en_US' : 'zh_CN' })
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })

  const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  const canonical = `${window.location.origin}${basePath}${to.fullPath}`
  upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonical })
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })

  const scriptId = 'sbti-seo-jsonld'
  let jsonLd = document.getElementById(scriptId)
  if (!jsonLd) {
    jsonLd = document.createElement('script')
    jsonLd.setAttribute('type', 'application/ld+json')
    jsonLd.setAttribute('id', scriptId)
    document.head.appendChild(jsonLd)
  }
  jsonLd.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: isEn ? 'SBTI Personality Test' : 'SBTI 人格测试',
    url: `${window.location.origin}${import.meta.env.BASE_URL}`,
    inLanguage: isEn ? 'en-US' : 'zh-CN',
    description,
    keywords
  })
})

export default router
