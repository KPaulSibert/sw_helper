<script>
import { ref,inject, reactive } from 'vue'
import io from "../io"
const outs = reactive({});
io.on('conosole out',({cmd,data})=>{
    if(!outs[cmd]){outs[cmd] = {out:''}}
    outs[cmd].out+=data;
}); 
io.on('conosole end',({cmd,out})=>{
    outs[cmd].finished = out||'finished';
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
            <q-expansion-item v-for="out,proc in outs" :key="proc" :label="proc" :color="out.finished?'red':'black'">
                <q-card>
                    <q-card-section >
                        <div v-for="p,i in out.out.split('\n')" :key="i">
                            {{p}}
                        </div>
                        <div v-if="out.finished" style="color:red">
                            {{out.finished}}
                        </div>
                    </q-card-section>
                </q-card>
            </q-expansion-item>
        </q-list>
    </q-page>
</template>