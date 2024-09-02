import { createRouter, createWebHashHistory } from 'vue-router'
import AboutPage from './components/AboutPage.vue'
import NumberGuessingGame from './components/NumberGuessingGame.vue'

const routes = [
  { path: '/', component: NumberGuessingGame },
  { path: '/about', component: AboutPage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
