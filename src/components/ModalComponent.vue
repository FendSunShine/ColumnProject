<template>
<teleport to="#modal">
    <div class="modal d-block"  tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ title }}</h5>
                <button type="button" class="btn-close" @click.prevent="onClose" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <slot></slot>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click.prevent="onClose">关闭</button>
                <button type="button" class="btn btn-primary" @click.prevent="onConfirm">确定</button>
            </div>
        </div>
    </div>
</div>
</teleport>
</template>

<script setup lang="ts">import { onUnmounted } from 'vue-demi';

const node = document.createElement('div')
node.id = 'modal'
document.body.appendChild(node)
onUnmounted(() => {
    document.body.removeChild(node)
})
defineProps({
    title:{
        type:String
    }
})
const emits = defineEmits(['modal-on-close', 'modal-on-confirm'])
const onClose = () => {
    emits('modal-on-close')
}
const onConfirm = () => {
    emits('modal-on-confirm')
}
</script>

<style scoped>

</style>