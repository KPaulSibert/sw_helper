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
    <div>
        {{$route.params.name}}
    </div>
</template>