import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Plugins from "./views/Plugins.vue"
import Console from "./views/Console.vue"
import PluginDetail from "./views/Plugin.vue"
const menu = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    icon:"home"
  },
  {
    path: '/plugins',
    name: 'Plugins',
    component: Plugins,
    icon:"extension"
  },
  {
    path:'/console',
    name:'Console',
    component:Console,
    icon:'preview'
  }
]
const routes = [...menu,
  {path: '/plugins/:name',name:'plugin',component:PluginDetail}
]
const router = createRouter({
  history: createWebHistory(),
  routes,
  menu
})

export default router
