<script>
import {ref} from "vue"
import { api } from '../io'
async function getDirTree(path){
    console.log(path)
    const items = await api('getDir',{name:path});
    return items.map((name)=>({label:name,path:path+'/'+name,lazy:!name.includes('.')}));
}
export default {
  setup() {
    return {tree:ref([]),file:ref("")}
  },
  async mounted(){
      this.name = this.$route.params.name
     const tree = await getDirTree(`vendor/shopware/storefront/Resources/views/storefront`)
     this.tree = tree
  },
  methods:{
    async show(node){
        
        this.file = {text:await api('readFile',{path:node.path}),path:node.path}
    },
    extend(){
        const path = `custom/plugins/${this.name}/src`+this.file.path.substr(26)
        const val = `{% sw_extends '@Storefront/${this.file.path.substr(42)}' %}`
        api('writeFile',{path,val})
    },
    async lazyLoad({ node, key, done, fail }){
        
        getDirTree(node.path).then(done)
    }
  }
}
</script>
<template>
    <q-page class="row">
        <q-scroll-area class="col-6" :style="{maxWidth:'600px'}">
            <q-tree @lazy-load="lazyLoad" :nodes="tree" node-key="path">
                <template v-slot:default-header="prop">
                    <div @click="show(prop.node)" class="text-weight-bold text-primary">{{ prop.node.label }}</div>
                </template>
            </q-tree>
        </q-scroll-area>
        <q-scroll-area class="col">
            <pre>{{file.text}}</pre>
        </q-scroll-area>
        <teleport :to="$root.$refs.tools">
            <q-btn v-if="file" round flat icon="mode" @click="extend"/>
        </teleport>
    </q-page>
</template>