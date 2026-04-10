<template>
  <div class="gallery-container">
     <div class="header">
       <h1 class="title">{{ isCN ? '🎭 全人类精神状态图鉴 🎭' : '🎭 The Complete Vibe Encyclopedia 🎭' }}</h1>
       <p class="subtitle">{{ isCN ? 'SBTI 隐藏人格画廊 - 全部人格卡片' : 'SBTI Hidden Gallery - All Personality Cards' }}</p>

       <div class="version-toggle">
         <button
           class="toggle-btn"
           :class="{ active: currentVersion === 'cn' }"
           @click="switchVersion('cn')"
         >
           CN 经典中文版
         </button>
         <button
           class="toggle-btn"
           :class="{ active: currentVersion === 'en' }"
           @click="switchVersion('en')"
         >
           EN American Meme Edition
         </button>
       </div>

       <button class="back-btn" @click="$router.push(`/${currentVersion}`)">{{ isCN ? '返回首页' : 'Back to Home' }}</button>
     </div>

     <div class="cards-grid">
       <div v-for="(item, key) in displayLibrary" :key="key" class="card">
         <div class="card-header">
           <span class="type-code">{{ item.code }}</span>
           <h2 class="type-name" v-if="currentVersion === 'cn'">{{ item.cn }}</h2>
           <h2 class="type-name-v2" v-else>
             <div class="cn-name">{{ item.cn }}</div>
             <div class="en-name">{{ item.en }}</div>
           </h2>
         </div>
        <div class="card-intro">"{{ item.intro }}"</div>
        <div class="card-desc">{{ item.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TYPE_LIBRARY } from '../data/sbtiData.js'
import { TYPE_LIBRARY_EN } from '../data/sbtiDataEN.js'

const router = useRouter()
const route = useRoute()

const currentVersion = computed(() => {
  return route.params.version === 'cn' ? 'cn' : 'en'
})

const isCN = computed(() => currentVersion.value === 'cn')

// biome-ignore lint/correctness/noUnusedVariables: used in template
const displayLibrary = computed(() => {
  return currentVersion.value === 'cn' ? TYPE_LIBRARY : TYPE_LIBRARY_EN
})

// biome-ignore lint/correctness/noUnusedVariables: used in template
const switchVersion = (ver) => {
  router.push(`/${ver}/gallery`)
}
</script>

<style scoped>
.gallery-container {
  min-height: 100vh;
  background-color: #f7f9fc;
  padding: 40px 20px;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  color: #333;
}
.header {
  text-align: center;
  margin-bottom: 40px;
}
.title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 800;
}
.subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 20px;
}
.version-toggle {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}
.toggle-btn {
  background-color: #e0e0e0;
  color: #555;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}
.toggle-btn.active {
  background-color: #2ecc71;
  color: white;
  box-shadow: 0 4px 10px rgba(46, 204, 113, 0.3);
}
.back-btn {
  background-color: #000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
  font-weight: bold;
}
.back-btn:hover {
  transform: scale(1.05);
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}
.card:hover {
  transform: translateY(-5px);
  border-color: #000;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
}
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}
.type-code {
  background: #000;
  color: #fff;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  letter-spacing: 1px;
}
.type-name {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  color: #2c3e50;
}
.type-name-v2 {
  display: flex;
  flex-direction: column;
  margin: 0;
}
.cn-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: #2c3e50;
}
.en-name {
  font-size: 1rem;
  color: #3498db;
  font-weight: 600;
}
.card-intro {
  font-size: 1.1rem;
  font-style: italic;
  color: #e74c3c;
  margin-bottom: 15px;
  font-weight: 500;
}
.card-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #555;
  text-align: justify;
  flex-grow: 1;
}
</style>
