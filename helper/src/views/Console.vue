<script>
import { ref,inject, reactive } from 'vue'
import io from "../io"
const outs = reactive({});
io.on('conosole out',({cmd,data})=>{
    if(!outs[cmd]){outs[cmd] = ""}
    outs[cmd]+=data;
}); 
export default {
    
    setup() {

        return {outs} 
    },
}
</script>
<template>
    <q-page>
        <q-list>
            <q-expansion-item v-for="out,proc in outs" :key="proc" :label="proc">
                <q-card>
                    <q-card-section >
                        <div v-for="p,i in out.split('\n')" :key="i">
                            {{p}}
                        </div>
                    </q-card-section>
                </q-card>
            </q-expansion-item>
        </q-list>
    </q-page>
</template>