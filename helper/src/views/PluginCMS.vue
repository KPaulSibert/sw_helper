<script>
import {ref,reactive,inject,provide,watch,computed} from "vue"
import jsonEditor from "../components/json-editor" 
export default {
    components:{jsonEditor},
    setup(){
        const types = ["commerce", "form", "image", "sidebar", "text-image", "text", "video"]
        const name = inject('name')
        const data = DATA.plugins[name]
        if(!data.cms){data.cms=[]}
        return {data,newCMSname:ref(''),sel:ref(),types}
    },
    methods:{
        create(){
            const name = this.newCMSname
            this.data.cms.push({name,label:name,category:'image-text'}) 
            this.newCMSname = null
        },
        remove(cms){
            if(this.sel==cms){this.sel = undefined}
            const arr = this.data.cms
            arr.splice(arr.indexOf(cms),1)
        }
    }
}
</script>
<template>
    <q-card class="row no-wrap">
        <q-list class="col-4">
            <q-item v-for="cms in data.cms" clickable @click="sel=cms" :active="cms==sel">
                <q-item-section>
                    {{cms.name}}
                </q-item-section>
                <q-item-section avatar>
                    <q-btn @click.stop="remove(cms)" flat round icon="delete"/>
                </q-item-section>
            </q-item>
            <div class="flex q-pa-sm">
                <q-input dense outline v-model="newCMSname"/>
                    <q-btn @click="create" dense class="col">Create</q-btn>
            </div>        
        </q-list>
        <q-separator vertical/>
        <div class="col-8 q-pa-md q-gutter-md" v-if="sel">
            <div> Element<q-toggle v-model="sel.isBlock"/>Block </div>
            <q-input v-model="sel.name" label="name" outlined />
            <q-select v-if="sel.isBlock" v-model="sel.category" :options="types" label="category" outlined />
            <q-input v-model="sel.label" :input="sel.lablel||sel.name" label="label" outlined />
            <json-editor v-model="sel.slots" label="slots"/>
        </div>
    </q-card>
    
</template>