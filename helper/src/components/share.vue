<script>
export default {
    props:['mit','is'],
    data(){return {hide:false}},
    created(){
        if(this.mit){this.mit.hide=true}
    },
    watch:{
        mit(v){console.log(v)}
    },
    unmounted(){
        if(this.mit){this.mit.hide=false}
    }
}
</script>
<template>
    <component v-if="!mit" :is="is||'span'" v-bind="$attrs">
        <slot v-if="!hide"/>
    </component>
    <teleport v-else :to="mit.$el"><slot/></teleport>
</template>