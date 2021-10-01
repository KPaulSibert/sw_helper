<script>
import {ref,reactive,inject,provide,watch,computed} from "vue"
import {useRoute} from "vue-router"
import PTemplate from "./PlunginTemplate.vue"
import PCms from "./PluginCMS.vue"
export default {
    components:{
        PTemplate,
        PCms
    },
    setup() {
        provide('name',useRoute().params.name)
        return {tab:ref('template')}
    },
}
</script>
<template>
    <q-page class="column">
        <q-tabs
        v-model="tab"
        dense
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        >
            <q-tab name="template" label="Template" />
            <q-tab name="cms" label="CMS" />
            <q-tab name="module" label="Modules" />
        </q-tabs>
            <q-tab-panels v-model="tab" class="col">
                <q-tab-panel name="template" class="absolute">
                    <p-template/>
                </q-tab-panel>
                <q-tab-panel name="cms" class="absolute">
                    <p-cms/>
                </q-tab-panel>
            </q-tab-panels>
    </q-page>
</template>