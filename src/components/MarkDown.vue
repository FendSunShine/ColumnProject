<template>
    <div>
        <textarea
        ref="textArea"
        ></textarea>
    </div>
</template>

<script setup lang="ts">
import EasyMDE, {Options} from 'easymde'
import { onMounted, onUnmounted, ref, watch } from 'vue';
// 首先封装外部库组件考虑：传入的属性值，传入的自定义事件，传出的方法
// 属性值
interface mdeProps {
    // 该库的
    options?: Options,
    // 我需要的
    modelValue: string
}
// 方法
interface mdeEvents {
    // 更新v-model绑定的值时
    (type:'update:modelValue',value: string) : void
    // 输入时改变
    (type: 'change', value: string): void;
    (type: 'blur'): void;
}
// 这样就不用在下面定义了，直接用接口
const props = defineProps<mdeProps>()
const emits = defineEmits<mdeEvents>()
const textArea = ref<undefined | HTMLTextAreaElement>()
const innerValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
    if (mdeInstance) {
        if (newValue !== innerValue.value) {
            mdeInstance.value(newValue || '')
        }
    }
})

// mde实例
let mdeInstance: EasyMDE | null = null
onMounted(() => {
    // 组装options
    const opts : Options = {
        ...props.options,
        element:textArea.value,
        initialValue: innerValue.value,
        // spellChecker:false
    }
    // 创建
    mdeInstance = new EasyMDE(opts)
    // 添加事件
    // 监控对应的事件
    mdeInstance.codemirror.on('change', () => {
        if (mdeInstance) {
            // 拿到当前的值
            const updatedValue = mdeInstance.value()
            innerValue.value = updatedValue
            emits('update:modelValue', updatedValue)
            emits('change', updatedValue)
        }
    })
    mdeInstance.codemirror.on('blur', () => {
        if (mdeInstance) {
            emits('blur')
        }
    })
})

// 销毁对应的实例
onUnmounted(() => {
    if (mdeInstance) {
        mdeInstance.cleanup()
    }
    mdeInstance = null
})
const clear = () => {
    if (mdeInstance){
        mdeInstance.value('')
    }
}
const getMDEInstance = () => {
    return mdeInstance
}
defineExpose({
    clear,
    getMDEInstance
})
</script>

<style scoped>
.is-invalid {
    border: 1px solid #dc3545;
}
</style>