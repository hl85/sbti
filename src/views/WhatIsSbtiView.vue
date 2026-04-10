<template>
  <div class="page">
    <div class="hero">
      <div class="lang-toggle">
        <button class="toggle-btn" :class="{ active: lang === 'zh' }" @click="lang = 'zh'">中文</button>
        <button class="toggle-btn" :class="{ active: lang === 'en' }" @click="lang = 'en'">English</button>
      </div>
      <h1>{{ t.title }}</h1>
      <p class="subtitle">{{ t.subtitle }}</p>
      <div class="hero-actions">
        <button class="back-btn" @click="goBack">{{ t.back }}</button>
      </div>
    </div>

    <section class="card">
      <h2>{{ t.quickTitle }}</h2>
      <ul>
        <li v-for="(item, idx) in t.quickList" :key="idx">{{ item }}</li>
      </ul>
    </section>

    <section class="card">
      <h2>{{ t.originTitle }}</h2>
      <p>{{ t.originBody }}</p>
    </section>

    <section class="card">
      <h2>{{ t.spreadTitle }}</h2>
      <p>{{ t.spreadBody }}</p>
    </section>

    <section class="card">
      <h2>{{ t.screensTitle }}</h2>
      <p class="caption">{{ t.screensCaption }}</p>
      <div class="shots">
        <article v-for="shot in t.screenshots" :key="shot.title" class="shot-card">
          <img :src="shot.image" :alt="shot.title" loading="lazy" />
          <div class="shot-meta">
            <h3>{{ shot.title }}</h3>
            <p>{{ shot.desc }}</p>
            <a :href="shot.link" target="_blank" rel="noreferrer">{{ t.openSource }}</a>
          </div>
        </article>
      </div>
    </section>

    <section class="card">
      <h2>{{ t.referencesTitle }}</h2>
      <ul class="refs">
        <li v-for="ref in t.references" :key="ref.link">
          <a :href="ref.link" target="_blank" rel="noreferrer">{{ ref.title }}</a>
          <span>{{ ref.note }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import qiluShot from '../assets/qilu.png'
import krShot from '../assets/36kr.png'
import biliShot from '../assets/bili.png'

const router = useRouter()
const lang = ref('zh')

const content = {
  zh: {
    title: 'What is SBTI？',
    subtitle: '一个“玩梗型人格测试”：借用 MBTI 外壳，但核心是网络语境里的幽默、自嘲与情绪命名。',
    back: '返回首页',
    quickTitle: '一句话速览',
    quickList: [
      'SBTI 全称 Silly Big Personality Test，定位是娱乐向测试，不是心理学诊断工具。',
      '它通过夸张、荒诞、强互联网语感的问题和结果标签，制造“被说中 + 想截图分享”的传播体验。',
      '测试在短时间内爆火，属于典型“社交媒体病毒传播”案例。'
    ],
    originTitle: '它从哪里来？',
    originBody: '公开报道显示，SBTI 由 B站 UP 主“蛆肉儿串儿”相关内容引爆传播，最早是以整活和劝朋友戒酒为起点，随后链接在社交平台快速扩散，形成大规模二次传播。',
    spreadTitle: '为什么会火？',
    spreadBody: '因为它不是“严肃测评”路线，而是“高密度梗 + 高共鸣表达 + 低参与门槛”。用户几分钟完成测试后可直接晒结果，结果名称本身就是社交话题，天然适合评论区接龙与转发。',
    screensTitle: '网络抓取截图',
    screensCaption: '下方截图来自公开网页的在线抓图（用于说明传播背景与来源线索）。',
    openSource: '打开原文',
    referencesTitle: '参考来源',
    references: [
      {
        title: '齐鲁晚报：SBTI 一夜引爆全网（含起源与传播描述）',
        link: 'https://m.qlwb.com.cn/detail/27466231.html',
        note: '用于页面中的中文解释摘要'
      },
      {
        title: '36Kr：SBTI 现象级刷屏的背景报道',
        link: 'https://36kr.com/p/3760230172111624',
        note: '用于传播与产品形态补充'
      },
      {
        title: 'B站作者主页（蛆肉儿串儿）',
        link: 'https://space.bilibili.com/417038183',
        note: '用于来源背景展示'
      }
    ],
    screenshots: [
      {
        title: '截图 1：齐鲁晚报相关报道',
        desc: '页面抓图展示“MBTI已经过时，SBTI来了”等传播叙述。',
        image: qiluShot,
        link: 'https://m.qlwb.com.cn/detail/27466231.html'
      },
      {
        title: '截图 2：36Kr 传播分析报道',
        desc: '展示媒体对 SBTI 爆火机制的分析视角。',
        image: krShot,
        link: 'https://36kr.com/p/3760230172111624'
      },
      {
        title: '截图 3：B站作者主页',
        desc: '展示创作者主页背景信息。',
        image: biliShot,
        link: 'https://space.bilibili.com/417038183'
      }
    ]
  },
  en: {
    title: 'What is SBTI?',
    subtitle: 'A meme-first personality test that borrows MBTI structure but focuses on humor, satire, and social sharing.',
    back: 'Back Home',
    quickTitle: 'Quick Summary',
    quickList: [
      'SBTI stands for Silly Big Personality Test and is explicitly entertainment-focused, not a clinical tool.',
      'Its design relies on internet-native language, absurd options, and highly shareable result labels.',
      'The format is short and social, so screenshots spread quickly across platforms.'
    ],
    originTitle: 'Where did it come from?',
    originBody: 'Public reports describe SBTI as a Bilibili-driven meme test that started from creator-side joke content and then exploded through social repost chains.',
    spreadTitle: 'Why did it spread so fast?',
    spreadBody: 'It mixes low friction (quick to finish), high emotional signal (“this is literally me”), and instant screenshot value. That combination makes it ideal for viral social loops.',
    screensTitle: 'Web-Captured Screenshots',
    screensCaption: 'The screenshots below are captured from public web pages to document context and origin signals.',
    openSource: 'Open Source',
    referencesTitle: 'References',
    references: [
      {
        title: 'Qilu Evening News: SBTI breakout coverage',
        link: 'https://m.qlwb.com.cn/detail/27466231.html',
        note: 'used for origin + spread summary'
      },
      {
        title: '36Kr: analysis of viral spread',
        link: 'https://36kr.com/p/3760230172111624',
        note: 'used for product/viral framing'
      },
      {
        title: 'Bilibili creator page',
        link: 'https://space.bilibili.com/417038183',
        note: 'used for creator context'
      }
    ],
    screenshots: [
      {
        title: 'Shot 1: Qilu coverage page',
        desc: 'Captured page showing origin and timeline narrative.',
        image: qiluShot,
        link: 'https://m.qlwb.com.cn/detail/27466231.html'
      },
      {
        title: 'Shot 2: 36Kr article page',
        desc: 'Captured page showing mainstream spread analysis.',
        image: krShot,
        link: 'https://36kr.com/p/3760230172111624'
      },
      {
        title: 'Shot 3: Bilibili creator page',
        desc: 'Captured page showing creator profile context.',
        image: biliShot,
        link: 'https://space.bilibili.com/417038183'
      }
    ]
  }
}

const t = computed(() => content[lang.value])

function goBack() {
  router.push(lang.value === 'zh' ? '/cn' : '/en')
}
</script>

<style scoped>
.page {
  max-width: 980px;
  margin: 0 auto;
  padding: 20px 16px 56px;
}

.hero {
  border: 1px solid #dbe8dd;
  border-radius: 20px;
  background: linear-gradient(180deg, #fff, #fbfdfb);
  padding: 22px;
}

.hero h1 {
  margin: 12px 0 8px;
  font-size: 32px;
}

.subtitle {
  color: #5d6a62;
  line-height: 1.7;
}

.lang-toggle {
  display: inline-flex;
  gap: 8px;
  padding: 6px;
  background: #edf6ef;
  border: 1px solid #dbe8dd;
  border-radius: 999px;
}

.toggle-btn {
  border: none;
  background: transparent;
  color: #5d6a62;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.toggle-btn.active {
  color: #fff;
  background: #4d6a53;
}

.hero-actions {
  margin-top: 12px;
}

.back-btn {
  border: 1px solid #dbe8dd;
  background: #edf6ef;
  color: #4d6a53;
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 700;
  cursor: pointer;
}

.card {
  margin-top: 16px;
  border: 1px solid #e8f0ea;
  border-radius: 18px;
  background: #fff;
  padding: 18px;
}

.card h2 {
  margin: 0 0 10px;
}

.card p, .card li {
  color: #344139;
  line-height: 1.75;
}

.caption {
  color: #6f7d73;
}

.shots {
  margin-top: 12px;
  display: grid;
  gap: 14px;
}

.shot-card {
  border: 1px solid #e8f0ea;
  border-radius: 14px;
  overflow: hidden;
  background: #f8fbf8;
}

.shot-card img {
  width: 100%;
  display: block;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.shot-meta {
  padding: 12px;
}

.shot-meta h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.shot-meta p {
  margin: 0 0 8px;
}

.shot-meta a {
  color: #2f6f45;
  text-decoration: none;
  font-weight: 700;
}

.refs {
  display: grid;
  gap: 8px;
}

.refs li {
  display: grid;
  gap: 2px;
}

.refs a {
  color: #2f6f45;
  font-weight: 700;
  text-decoration: none;
}

.refs span {
  font-size: 13px;
  color: #6f7d73;
}
</style>
