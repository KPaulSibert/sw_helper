<script>
import {ref} from "vue"
import { api } from '../io'
export default {
  setup() {
    return {list:ref([])}
  },
  async mounted(){
    this.list = (await api('getDir',{name:'custom/plugins'})).filter(e=>e!='.gitkeep')
  },
  methods:{
    async update(name){
      await api('updatePlugin',{name})
    }
  }
}
</script>
<template>
  <q-page class="flex justify-center row">
    <div>
    <q-card > 
        <q-list>
            <q-item v-for="e in list" :key="e" clickable v-ripple @click="$router.push({name:'plugin',params:{name:e}})">
            <q-item-section>{{e}}</q-item-section>
            <q-item-section avatar><q-btn flat round @click="update(e)" icon="cached"/></q-item-section>
            </q-item>
        </q-list>
    </q-card>
    </div>
    
  </q-page>
</template>