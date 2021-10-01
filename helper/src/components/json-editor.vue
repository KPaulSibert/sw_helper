<script>
export default {
    props:['modelValue','label'],
    computed:{
        json:{
            get(){try {return JSON.stringify(this.modelValue,null,3);}catch{return '"error"'}},
            set(v){try {this.$emit('update:modelValue',JSON.parse(v))}catch{}}
        }
    }
}
</script>
<template>
    <q-input v-model.lazy="json" type="textarea" :lablel="label"/>
</template>