import { createRouter, createWebHistory } from 'vue-router'
import NumberGuessingGame from './components/NumberGuessingGame.vue'
import AboutPage from './components/AboutPage.vue'

const routes = [
  { path: '/', component: NumberGuessingGame },
  { path: '/about', component: AboutPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router