<template>
        <ModalComponent title="删除文章" v-if="ModalIsVisibble"
        @modal-on-close="ModalIsVisibble = false"
        @modal-on-confirm="deletePost"
        >
            <p class="text-center">是否删除文章?</p>
        </ModalComponent>
        <div class="post-detail-page">
        <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
            <img :src="HandleImgUrl(currentImageUrl)" alt="currentPost.title" 
            class="rounded-lg img-fluid my-4" v-if="currentImageUrl">
            <h2 class="mb-4">{{currentPost.title}}</h2>
            <div class="user-profile-component border-top 
            border-bottom py-3 mb-5 align-items-center row g-0">
            <div class="col">
                <UserProfile v-if="typeof currentPost.author === 'object'" :user="currentPost.author"></UserProfile>
            </div>
            <span class="text-muted col text-end font-italic"
            >发表于：{{currentPost.createdAt}}</span>
            </div>
            <div v-html="currentHtml"></div>

            <div v-if="showEditArea" class="w-100 mt-5 d-flex justify-content-end align-items-center">
                <router-link
                type="button"
                class="edit-del-btn edit-btn"
                :to="{name: 'create', query: { id: currentPost._id}}"
                >
                编辑
                </router-link>
                <button type="button" class="edit-del-btn del-btn" @click.prevent="ModalIsVisibble = true">删除</button>
            </div>
        </article>
        </div>

</template>
<script setup lang="ts">
import ModalComponent from '../components/ModalComponent.vue';
import {marked} from 'marked'
import UserProfile from '../components/UserProfile.vue';
import { useRoute } from 'vue-router';
import { PostProps, avatarProps, useUserStore } from '../stores';
import { computed, ref } from 'vue';
import { UserProps } from '../stores';
import createMessage from '../components/CreateMessage';
import router from '../routers';
import { HandleImgUrl } from '../../helper';
const ModalIsVisibble = ref(false)
const route = useRoute()
const pid = route.params.pid as string
const userStore = useUserStore()
userStore.fetchPost(pid)
const currentPost = computed<PostProps>(() => userStore.getPostById(pid))
const currentImageUrl = computed(() => {
        if (currentPost.value && currentPost.value.image) {
            const { image } = currentPost.value
            return (image as avatarProps).url + '?x-oss-process=image/resize,w_850'
        } else {
            return null
        }
    })
const currentHtml = computed(() => {
    if (!currentPost.value.content) return ''
    if(currentPost.value.isHTML) {
        return currentPost.value.content
    } else {
        return marked.parse(currentPost.value.content)
    }
})
const showEditArea = computed(() => {
    const {isLogin, _id} = userStore.user
    // 如果本专栏作者与登录作者一样，这返回true
    if (isLogin && currentPost.value && currentPost.value.author){
        const currentAuthor = currentPost.value.author as UserProps
        return _id == currentAuthor._id
    } else {
        return false
    }
})
// 删除
const deletePost = () => {
    userStore.deletePostById(pid).then(() => {
        ModalIsVisibble.value = false
        createMessage('删除成功！跳转专栏列表', 'success')
        router.push({name:'column', params:{id:userStore.user.column}})

    })
}
</script>
<style  scoped lang="scss">
    .edit-del-btn {
        width: 100px;
        height: 50px;
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 1.15px;
        color: #f9f9f9;
        // box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
        border: none;
        transition: 0.25s;
    }
    .edit-btn {
        display: block;
        text-decoration:none;
        text-align: center;
        line-height: 50px;
        border-radius: 25px 0 0 25px;
        background-color: #4B70E2;
    }
    .del-btn {
        border-radius: 0 25px 25px 0 ;
        background-color: rgb(212, 80, 80);
    }
</style>