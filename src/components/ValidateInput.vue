<template>
    <!-- i input里面的先去掉@blur="validateinputRef" -->
    <input
    :class='inputRef.error ? "form-control is-invalid" : "form-control " '
    :value="inputRef.val"
    @input="updataValue"
    v-bind="$attrs"
    required>
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
</template>

<script  lang="ts">
import {PropType, onMounted, reactive} from 'vue'
import {emitter} from './ValidateForm.vue'
const inputRefReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
interface RuleProps {
        type: 'required' | 'email';
        message: string;
    }
export type RulesProps = RuleProps[]

export default {
    inheritAttrs: false,
    props:{
        rules: Array as PropType<RulesProps>,
        modelValue: String
    },
    setup(props, context){
        const inputRef = reactive({
            val: props.modelValue || '',
            error: false,
            message: ''
            })
        const validateinputRef = ():boolean => {
            if (props.rules){
                const allPassed =  props.rules.every(rule => {
                let passed = true
                inputRef.message = rule.message
                switch(rule.type){
                    case 'required':
                        passed = (inputRef.val.trim() !== '')
                        break
                    case 'email':
                        passed = inputRefReg.test(inputRef.val.trim())
                        break
                    default: 
                        break
                    
                }
                return passed
            })
            inputRef.error = !allPassed
            }

            return false
            

        }
        const updataValue = (e: Event) => {
            const targetValue = (e.target as HTMLInputElement).value
            console.log(targetValue);
            inputRef.val = targetValue
            context.emit('update:modelValue', targetValue)
        }
        // 将事件发射出去，其实就是把验证函数发射出去
        onMounted(() => {
            emitter.emit('form-item-created', validateinputRef)
        })
        return {
            inputRef,
            validateinputRef,
            updataValue
        }

    }

}

</script>

<style lang="scss" scoped>

</style>