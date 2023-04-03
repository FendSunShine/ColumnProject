<template lang="">
    <div class="dropdown" ref='dpRef'>
        <a href="#" class="
        btn dropdown-toggle 
        btn-outline-light my-2
        "
        ref = "dropdownRef"
        @click.prevent=toggleIsOpenFn>{{title}}</a>
        <ul class="dropdown-menu" style="display: block" v-if="isOpen">
            <li><a class="dropdown-item disabled" href="#">新建文章</a></li>
            <li><a class="dropdown-item" href="#">编辑资料</a></li>
            <li><a class="dropdown-item" href="#">退出登录</a></li>
        </ul>
    </div>
</template>
<script lang="ts">
import { defineComponent,  ref, watch } from 'vue'
import useClickOutside from '../hooks/useClickOutside'
export default defineComponent({
    name: 'DropDown',
    props: {
        title: {
            type: String,
            required: true
        }
    },
    setup(){
        const isOpen = ref(false)
        const toggleIsOpenFn = () => {
            isOpen.value = !isOpen.value
        }
        const dpRef = ref<null | HTMLElement>(null)
        const isOutside = useClickOutside(dpRef)
        watch(isOutside, () => {
            if (isOutside.value && isOpen.value){
            isOpen.value = false
        }
        })
        return {
            toggleIsOpenFn,
            isOpen,
            dpRef
        }
    },
})
</script>
<style lang="">
    
</style>