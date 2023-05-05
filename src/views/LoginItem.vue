<template>
    <div class="login-page mx-auto p-3 w-330 loginAndSignup">
        <h5 class="my-4 text-center login-title">登入账号</h5>
        <validate-form @form-submit="onFormSubmit">
        <div class="mb-3">
            <!-- <label class="form-label">邮箱地址</label> -->
            <validate-input
            :rules="emailRules" v-model="emailVal"
            placeholder="请输入邮箱地址"
            type="text"
            ref="inputRef"
            class="form_input"
            />
        </div>
        <div class="mb-3">
            <!-- <label class="form-label">密码</label> -->
            <validate-input
            type="password"
            placeholder="请输入密码"
            class="form_input"
            :rules="passwordRules"
            v-model="passwordVal"
            />
        </div>
        <template #submit>
            <button type="submit" class="login-button ">登录</button>
        </template>
        </validate-form>
        <button @click="useTestID"  class="useTestID">使用测试账号</button>
    </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {  ref } from 'vue'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProps } from '../components/ValidateInput.vue'
import { useUserStore } from '../stores';
import createMessage from '../components/CreateMessage';
    const userStore = useUserStore()
    const emailVal = ref()
    const router = useRouter()
    const emailRules: RulesProps = [
    { type: 'required', message: '电子邮箱地址不能为空' },
    { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const passwordVal = ref('')
    const passwordRules: RulesProps = [
    { type: 'required', message: '密码不能为空' }
    ]
    const onFormSubmit = (res: boolean) => {
        if (res){
            userStore.loginAndFetchCurrentUser({
                email: emailVal.value, password: passwordVal.value
            }).then(() => {router.push({path:'/'})})
            .catch(err => {
                userStore.error.message = err
                userStore.error.status = true
                createMessage(err, 'error', 2000)
            })
            // .catch(err => {
            //     console.log(err.response.data.error);
            // })
        }
    }
const useTestID = () => {
    console.log('/');
    emailVal.value = 'ss7758@qq.com'
    passwordVal.value = '020606'
}
</script>

<style >
.useTestID {
    height: 40px; 
    line-height: 37px;
    padding: 0 10px;
    background-color: transparent;
    border:dashed  2px #b5b5b5; 
    border-radius: 20px;
    color: #b6b5b5;
    transform: translate(43%,-105%);
}
.useTestID:hover{
    color: #4B70E2;
}
.loginAndSignup {
    width: 500px;
    box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;

}
.login-title {
    font-weight: bold;
    letter-spacing: 5px;
}
.form_input {
    padding-left: 25px;
    font-size: 13px;
    letter-spacing: 0.15px;
    border: none;
    outline: none;
    background-color: #ecf0f3;
    border-radius: 8px;
    box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
    padding-bottom: 10px;
        }
.form_input:focus {
    box-shadow: inset 4px 4px 4px #d1d9e6, inset -4px -4px 4px #f9f9f9;
    background-color: #ecf0f3;
}
.login-button {
            width: 100px;
            height: 50px;
            border-radius: 25px;
            margin-top: 30px;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 1.15px;
            background-color: #4B70E2;
            color: #f9f9f9;
            box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
            border: none;
            outline: none;
            transition: 0.25s;

        }
.login-button:hover{
    box-shadow: 6px 6px 10px #d1d9e6, -6px -6px 10px #f9f9f9;
    transform: scale(0.98);
}

</style>