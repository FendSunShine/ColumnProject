<template>
    <div class="column-detail-page w-75 mx-auto">
        <div class="column-info row column-top  mb-4 border-bottom pb-4 align-items-center" v-if="column">
            <div class="col-3 text-center">
                <img :src="column.avatar?.url" :alt="column.title" class="rounded-circle border"
                    style="width: 100px; height: 100px;">
            </div>
            <div class="col-9">
                <h4>{{ column.title }}</h4>
                <p class="text-muted">{{ column.description }}</p>
            </div>
        </div>
        <div class='goup' @click="goupFn">
            <svg t="1683174125102" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4397" width="48" height="48"><path d="M199.36 572.768a31.904 31.904 0 0 0 22.624-9.376l294.144-294.144 285.728 285.728a31.968 31.968 0 1 0 45.248-45.248L538.752 201.376a32 32 0 0 0-45.28 0L176.704 518.144a31.968 31.968 0 0 0 22.656 54.624z m339.424-115.392a32 32 0 0 0-45.28 0L176.736 774.144a31.968 31.968 0 1 0 45.248 45.248l294.144-294.144 285.728 285.728a31.968 31.968 0 1 0 45.248-45.248l-308.32-308.352z" p-id="4398" fill="#1296db"></path></svg>
        </div>
        <post-list :list="list"></post-list>

        <!-- 加载 -->
        <div class="loading text-center" v-if="!isLastPage">
            <div class="spinner-border text-primary"></div>
            <br>
            <span class="text-primary">加载更多中...</span>
        </div>

        <div   class="noMore d-flex flex-column align-items-center"
        :style="{display: !isLastPage ? 'none !important': 'flex !important' }"
        >
            <div class="text-center  h4 w-100" >没有更多内容</div>
                <router-link to="/" class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-block">回到主页</router-link>
        </div>

        <!-- <button
            class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-block"
            @click="loadMorePage"
            v-if="!isLastPage"
            >
            加载更多
        </button> -->
        <hr>
    </div>
</template>

<script setup lang="ts">
import PostList from '../components/PostList.vue'
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores';
import { computed, onUnmounted,  watch } from 'vue';
import useLoadMore from '../hooks/useLoadMore';
import { throttle } from 'lodash';
const route = useRoute()
const currentId = computed(() => (route.params.id as string))
const userStore = useUserStore()


// 只有currentId一变化就刷新所有数据
const column = computed(() => userStore.getcolumnsById(currentId.value))
const list = computed(() =>  {
    
    
    return userStore.getPostsByCid(currentId.value)
}
    )
const total = computed(() => userStore.posts.loadedColumns[currentId.value]?.total)
const currentPage = computed(() => userStore.posts.loadedColumns[currentId.value]?.currentPage)
// router.beforeEach((to, from) => {
//     if (from.path == '/create'){  
//         userStore.fetchPosts(currentId.value, { isForceFlush: true })
//         userStore.getcolumnsById(currentId.value)
//     }
// })








// 针对登录用户的情况
userStore.setLoginColumn(currentId.value)

const { isLastPage, loadMorePage } = useLoadMore('fetchPosts', total,
    { pageSize: 3, currentPage: currentPage.value ? currentPage.value + 1 : 2, cid: currentId.value })

// 针对与column页面切换column页面
function getData() {
    // userStore.fetchColumns() 
    if (currentId.value) {
        userStore.fetchPosts(currentId.value, { pageSize: 3, currentPage: 1 })
    }
}
watch(() => currentId.value, getData)
getData()



// 下拉到屏幕末尾就开始加载loadmore 
const handleScroll = throttle(() => {
    const scrollY = window.scrollY
    // 页面可视高度
    const singleHight = window.innerHeight
    // 整个页面高度
    const maxScrollY = document.body.scrollHeight
    if (scrollY + singleHight + 50 > maxScrollY) {
        // 滚到底了
        // 加载更多
        loadMorePage()
    }
}, 400)
window.addEventListener('scroll', handleScroll)

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
// 回到顶部
const goupFn = () => {
    window.scrollTo({
        left:0,
        top:0
    })
}
</script>

<style scoped lang="scss">
.column-top {
    border-radius: 10px;
    background-color: #ecf0f3;
    box-shadow: 2px 2px 2px #d1d9e6, -2px -2px 2px #f9f9f9;
    padding-top: 20px;
}
.noMore .h4{
    // background-color: white;
    height: 60px;
    font-weight: bold;
    letter-spacing: 5px;
    text-align: center;
    line-height: 60px;
    // box-shadow: 0 0  2px rgba(0, 0, 0, 0.3);
}
.goup {
    position: fixed;
    right: 4rem;
    bottom: 8rem;
    width: 4rem;
    text-align: center;
    line-height: 7rem;
    height: 7rem;
    border-radius: 2rem;
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
    background-color: #fff;
}
.goup:hover {
    box-shadow: 6px 6px 10px #d1d9e6, -6px -6px 10px #f9f9f9;
    transform: scale(0.98);
}
</style>