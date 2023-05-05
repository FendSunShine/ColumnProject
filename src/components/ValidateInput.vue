<template>
    <!-- i input里面的先去掉@blur="validateinputRef" -->
    <input
    v-if="tag == 'input'"
    :class='inputRef.error ? "form-control is-invalid" : "form-control " '
    v-model="inputRef.val"
    @blur="validateinputRef"
    v-bind="$attrs"
    required
    >
    <textarea
    v-if="tag == 'textarea'"
    :class='inputRef.error ? "form-control is-invalid" : "form-control " '
    v-model="inputRef.val"
    v-bind="$attrs"
    required
    />
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
</template>

<script  lang="ts">
import {PropType, computed, onMounted, reactive} from 'vue'
import {emitter} from './ValidateForm.vue'
const inputRefReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
export type tagType = 'input' | 'textarea'
interface RuleProps {
        type: 'required' | 'email' | 'custom';
        message: string;
        validator?: () => boolean;
    }
export type RulesProps = RuleProps[]

export default {
    inheritAttrs: false,
    props:{
        rules: Array as PropType<RulesProps>,
        modelValue: String,
        tag:{
            type: String as PropType<tagType>,
            default: 'input'
        } 
    },
    setup(props, context){
        const inputRef = reactive({
            val: computed({
                get:() => props.modelValue || '',
                set: (val) => {
                    context.emit('update:modelValue', val)
                }
            }),
            error: false,
            message: ''
            })
        // watch(() => props.modelValue, (newVal) => {
        //     inputRef.val = newVal || ''
        //     
        // })
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
                                case 'custom':
                                    passed = rule.validator ? rule.validator() : true
                                    break
                                default: 
                                    break
                                }
                                
                            return passed
                            })
                inputRef.error = !allPassed
                return allPassed
            } else {
                return false
            }
            
            

        }
        // const updataValue = (e: Event) => {
        //     const targetValue = (e.target as HTMLInputElement).value
        //     inputRef.val = targetValue
        //     
        //     context.emit('update:modelValue', targetValue)
        // }
        // 将事件发射出去，其实就是把验证函数发射出去
        onMounted(() => {
            emitter.emit('form-item-created', validateinputRef)
        
        })
        return {
            inputRef,
            validateinputRef
        }

    }

}

</script>

<style lang="scss" scoped>
.invalid-feedback{
    padding-left: 20px;
    font-weight: bold;
    color: rgb(228, 141, 141);
}
</style>