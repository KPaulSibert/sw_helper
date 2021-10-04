<script>
import {ref,inject} from "vue"
import { api } from '../io'
async function getDirTree(path){
    console.log(path)
    const items = await api('getDir',{name:path});
    return items.map((name)=>({label:name,path:path+'/'+name,lazy:!name.includes('.')}));
}
const PATH = 'vendor/shopware/administration/Resources/app/administration/src/module/sw-cms'
export default {
  setup() {
    const name = inject('name')
    return {tree:ref([]),file:ref(""),name}
  },
  async mounted(){
    this.name = this.$route.params.name
    this.tree = await getDirTree(PATH)
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
    },
    isCMS(node){
        return node.children?.filter(e=>e.label=='preview').length
    },
    create(path){
        path = path.substr(PATH.length)
        const name = prompt('name')
        if(name){
            api('extendCMS',{path,name,plugin:this.name})
        }
        
    }
  }
}
</script>
<template>
    <div class="row full-height">
        <q-scroll-area class="col-6" style="maxWidth:600px">
            <q-tree @lazy-load="lazyLoad" :nodes="tree" node-key="path">
                <template v-slot:default-header="prop">
                    <div @click="show(prop.node)" class="text-weight-bold text-primary row justify-between">
                        {{ prop.node.label }} 
                        <q-btn v-if="isCMS(prop.node)" @click.stop="create(prop.node.path)" icon="extension" size='xs' flat round/>
                    </div>
                </template>
            </q-tree>
        </q-scroll-area>
        <q-scroll-area class="col">
            <pre>{{file.text}}</pre>
        </q-scroll-area>
    </div>
</template>