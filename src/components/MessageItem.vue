<template>
    <!-- <teleport to='#message'> -->
        <div class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-4"
        :class="classObject" v-if="isVisible">
        <span>{{message}}</span>
        <button type="button" class="btn-close" aria-label="Close" @click.prevent="hide"></button>
        </div>
    <!-- </teleport> -->
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';

export type MessageType = 'success' | 'error' | 'default'
const props = defineProps({
    type:{
        type:String as PropType<MessageType>,
        default:'default'
    },
    message:String
})
const isVisible = ref(true)
const classObject = {
    'alert-success': props.type === 'success',
    'alert-danger': props.type === 'error',
    'alert-primary':  props.type === 'default'
}
const hide = () => {
    isVisible.value = false
    // document.body.removeChild(node)
}
// setTimeout(() => {
//     hide()
// }, 200)
// 创建message节点
// const node = document.createElement('div')
// node.id = 'message'
// document.body.appendChild(node)
// onUnmounted(() => {
//     document.body.removeChild(node)
// })
</script>

<style scoped>

</style>