<template>
    <div class="create-post-page mb-3" >
        <!-- 上传组件 -->
        <up-load action="/upload"
        :uploadData="uploadData"
        :beforeUpload="beforeUploadCheckFn"
        @file-uploaded="getImageID"
        class="upload-zone d-flex align-items-center justify-content-center bg-white  text-secondary w-100 my-4">

        <h3>点击上传或拖拽文件到框内</h3>

        <template #loading>
            <div class="d-flex">
                <div class="spinner-border text-secondary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <h2>正在上传</h2>
            </div>
        </template>
        <template #uploaded="UploadProps">
            <div class="uploaded-area">
                <img :src="HandleImgUrl(UploadProps.updataFile.value ? UploadProps.updataFile.value.url : UploadProps.updataFile.url)">
                <h3>点击重新上传</h3>
        </div>
        </template>

        </up-load>
        <!-- 表单 -->
        <validate-form @form-submit="onFormSubmit" class="">
        <div class="mb-3">
            <label class="form-label">文章标题：</label>
            <validate-input
            :rules="titleRules" v-model="titleVal"
            placeholder="请输入文章标题"
            type="text"
            />
        </div>
        <Markdown 
            v-model="mdeValue" 
            :options="mdeOptions"
            ref="mdeRef"
            @blur="checkMdeVal"
            :class="{'is-invalid': !editorStatus.isValid}"
        >
        </Markdown>
        <span v-if="!editorStatus.isValid" 
            class="invalid-feedback mt-1"
            >{{editorStatus.message}}
        </span>
            <template #submit>
                <button class="btn btn-primary btn-large">发表文章</button>
            </template>
        </validate-form>
    </div>
</template>

<script setup lang="ts">
import { HandleImgUrl } from '../../helper';
import {  ref,onBeforeMount, reactive, computed, watch } from 'vue';
import ValidateInput, { RulesProps } from '../components/ValidateInput.vue'
import easyMDE,{Options} from 'easymde'
import ValidateForm from '../components/ValidateForm.vue';
import Markdown from '../components/MarkDown.vue';
import { useUserStore } from '../stores';
import { PostProps } from '../stores';
import { useRoute, useRouter } from 'vue-router';
import UpLoad from '../components/UpLoad.vue';
import {beforeUploadCheck} from '../../helper'
import createMessage from '../components/CreateMessage';
import { AxiosResponse } from 'axios';
const titleVal = ref('')
const mdeValue = ref('')
const userStore = useUserStore()

const router = useRouter()
const route = useRoute()
let imageid = ''
const currentPostID  = computed(() => route.query.id as string)
const editorStatus = reactive({
    isValid:true,
    message:''
})
const uploadData = ref()
interface mdeRefProps {
    clear: () => void,
    getMDEInstance: () => easyMDE
}
const mdeRef = ref<null | mdeRefProps>(null)
const mdeOptions : Options = {
    spellChecker: false
}
const titleRules:RulesProps = [
        { type: 'required', message: '文章标题不能为空' }
    ]
const getImageID = ({data}:AxiosResponse<{_id:string}>) => data._id && (imageid = data._id)
const onFormSubmit = (res :boolean)  => {
    if(res){
        const {column, _id} = userStore.user
        if (column){
            const newPost: PostProps = {
                    author:_id,
                    content: mdeValue.value.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
                    title: titleVal.value,
                    column:column,
                }
        imageid && (newPost.image = imageid)
        // 判断是修改还是创建
        if (currentPostID.value){
            userStore.updataPost(currentPostID.value, newPost).then(() => {
                // 创建成功后跳转
                gotoColumnView(column)
                console.log(1);
            })
        } else {
            userStore.createPost(newPost).then(() => {
                // 创建成功后跳转
                gotoColumnView(column)
                console.log(2);
            })
                
        }
        }

    }
}
// 跳转后
const gotoColumnView = (column:string) => {
        // 跳转之前刷新clumns数据
        userStore.fetchPosts(column, {isForceFlush:true}).then(() => {       
        // 跳转创建的作者的主页详情
        router.push({
            name: 'column',
            params:{id : column}
        })
        })

}
const beforeUploadCheckFn = (file:File) => {
    const result = beforeUploadCheck(file, {format:['image/jpeg', 'image/png']})
    const { passed, error } = result
    if (error === 'format') {
        createMessage('上传图片只能是 JPG/PNG 格式!', 'error')
    }
    if (error === 'size') {
        createMessage('上传图片大小不能超过 1Mb', 'error')
    }
    return passed
}
const currentPostData = reactive<{value: PostProps}>({value : {title: '', column: '', content: ''}})
// 当修改时，本页面通过传过来的route的postID值，填充原本数据
onBeforeMount(async () => {
    // 问题：为什么textArea.value没有节点？
    // 因为在挂载之前没有dom节点
    // 
    if (currentPostID.value){
        currentPostData.value = await userStore.fetchPost(currentPostID.value as string)
        // 传入upload数据
        // await new Promise((resolve) => setTimeout(resolve, 3000));
        if (currentPostData.value &&  currentPostData.value.image){
            uploadData.value =  currentPostData.value.image
        }
        // 赋值其他数据
        // 
        titleVal.value =currentPostData.value.title
        mdeValue.value = currentPostData.value.content
}
})
const checkMdeVal = () => {
        if (mdeValue.value.trim() === '') {
            editorStatus.isValid = false
            editorStatus.message = '文章详情不能为空'
        } else {
            editorStatus.isValid = true
            editorStatus.message = ''
        }
    }
</script>

<style>

.create-post-page .file-upload-container {
    height: 200px;
    cursor: pointer;
    overflow: hidden;
}
.create-post-page .file-upload-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.btn.btn-primary.btn-large{
    transition: transform 0.2s ease-in-out;
}
.btn.btn-primary.btn-large:hover {
    transform: scale(0.985);
}
</style>