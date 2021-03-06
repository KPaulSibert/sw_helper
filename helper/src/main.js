import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
const app = createApp(App).use(Quasar, quasarUserOptions).use(router)
app.mount('#app')
