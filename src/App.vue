<template>
  
  <GlobalHeader :user=currentUser ></GlobalHeader>

  <ColumnList :list="testData"/>

  <ValidateForm @form-submit="onsubmit">
      <div class="mb-3 ">
        <label class="form-label">邮箱地址</label>
        <validate-input :rules="emailRules" 
        placeholder="请输入邮箱地址"
        type="text"
        ref="inputRef"
        v-model="emailRef"></validate-input>
      </div>
      <div class="mb-3 ">
        <label class="form-label">密码</label>
        <validate-input :rules="passwordRules"  
        placeholder="请输入密码"
        type="password"
        v-model="passwdRef"></validate-input>
      </div>
    <template v-slot:submit>
      <button type="submit" class="btn btn-danger">提交</button>
    </template>
  </ValidateForm>

  
</template>


<script setup lang="ts">
import {  ref } from 'vue';
import ColumnList, {ColumnProps} from './components/ColumnList.vue'
import GlobalHeader, {UserProps} from './components/GlobarHeader.vue'
import ValidateInput, {RulesProps}   from './components/ValidateInput.vue' 
import ValidateForm from './components/ValidateForm.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
const emailRef = ref()
const passwdRef = ref()
const testData: ColumnProps[] = [
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '这是的test2专栏，有一段非常有意思的简介，可以更新一下欧'
  },
  {
    id: 3,
    title: 'test1的专栏',
    description: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 4,
    title: 'test2的专栏',
    description: '这是的test2专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 5,
    title: 'test1的专栏',
    description: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 6,
    title: 'test2的专栏',
    description: '这是的test2专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  }
]
const currentUser: UserProps = {
  isLogin: true,
  name: '李鑫'

}
const emailRules: RulesProps = [
  { type: 'required', message: '电子邮箱地址不能为空' },
  { type: 'email', message: '请输入正确的电子邮箱格式' }
]
const passwordRules: RulesProps = [
{ type: 'required', message: '密码不能为空' },
]
const onsubmit = (e:boolean) => {
  console.log(e);
}

</script>


