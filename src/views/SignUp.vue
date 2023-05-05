<template>
    <div class="signup-page loginAndSignup mx-auto p-3 w-330">
        <h5 class="my-4 text-center login-title">注册者也账户</h5>
        <validate-form 
        @form-submit="onFormSubmit">
        <div class="mb-3">
            <!-- <label class="form-label">邮箱地址</label> -->
            <validate-input
            :rules="emailRules" v-model="formData.email"
            placeholder="请输入邮箱地址"
            class="form_input"
            type="text"
            />
        </div>
        <div class="mb-3">
            <!-- <label class="form-label">昵称</label> -->
            <validate-input
            :rules="nameRules" v-model="formData.nickName"
            placeholder="请输入昵称"
            class="form_input"
            type="text"
            />
        </div>
        <div class="mb-3">
            <!-- <label class="form-label">密码</label> -->
            <validate-input
            type="password"
            placeholder="请输入密码"
            class="form_input"
            :rules="passwordRules"
            v-model="formData.password"
            />
        </div>
        <div class="mb-3">
            <!-- <label class="form-label">重复密码</label> -->
            <validate-input
            type="password"
            placeholder="请再次密码"
            class="form_input"
            :rules="repeatPasswordRules"
            v-model="formData.repeatPassword"
            />
        </div>
        <template #submit>
            <button type="submit" class="login-button" style="width:150px">注册新用户</button>
        </template>
        </validate-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { RulesProps } from '../components/ValidateInput.vue';
import ValidateForm from '../components/ValidateForm.vue';
import ValidateInput from '../components/ValidateInput.vue';
import axios from 'axios';
import createMessage from '../components/CreateMessage';
import router from '../routers';
const formData = reactive({
    email: '',
    nickName: '',
    password: '',
    repeatPassword: ''
})
const emailRules: RulesProps = [
        { type: 'required', message: '电子邮箱地址不能为空' },
        { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const nameRules: RulesProps = [
        { type: 'required', message: '昵称不能为空' }
    ]
    const passwordRules: RulesProps = [
        { type: 'required', message: '密码不能为空' }
    ]
    const repeatPasswordRules: RulesProps = [
        { type: 'required', message: '重复密码不能为空' },
        {
            type: 'custom',
            validator: () => {
                return formData.password === formData.repeatPassword
            },
            message: '密码不相同'
        }
    ]
const onFormSubmit = (res:boolean) => {
    if(res) {
        const payload = {
            email: formData.email,
            password: formData.password,
            nickName: formData.nickName
        }
        axios.post('/users/', payload).then(() => {
            createMessage('注册成功 正在跳转登录页面', 'success', 2000)
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        }).catch(e => {
            if (e == 'Internal Server Error'){
                createMessage('注册成功 正在跳转登录页面', 'success', 2000)
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            } else {
                createMessage(e, 'error', 2000)
                console.log(e)
            }
        })
    }
    }
    
</script>