<template lang="">
    <div class="dropdown " ref='dpRef'>
        <a href="#" class="
        btn dropdown-toggle 
        btn-outline-light my-2
        "
        style="backgroundColor: #056de8"
        ref = "dropdownRef"
        @click.prevent=toggleIsOpenFn>{{title}}</a>
        <teleport to="#dropdownMenu">
            <ul class="dropdown-menu" style="display: block;" v-if="isOpen">
                <li><router-link  class="dropdown-item " to="/create">新建文章</router-link></li>
                <li><router-link class="dropdown-item" :to="{name:'column', params:{id:userStore.user.column}}">我的专栏</router-link></li>
                <!-- <li><a    class="dropdown-item" href="#">编辑资料</a></li> -->
                <li><a @click=layout class="dropdown-item" href="#">退出登录</a></li>
            </ul>
        </teleport>

    </div>

    <li ></li>
</template>
<script lang="ts">
import { defineComponent,  ref, watch } from 'vue'
import useClickOutside from '../hooks/useClickOutside'
import { useUserStore } from '../stores'
import createMessage from './CreateMessage'
import axios from 'axios'
import { useRouter } from 'vue-router'
import createDom from '../hooks/createDom'
export default defineComponent({
    name: 'DropDown',
    props: {
        title: {
            type: String,
            required: true
            
        } 
    },
    setup(){
        const userStore = useUserStore()
        const isOpen = ref(false)
        const toggleIsOpenFn = () => {
            isOpen.value = !isOpen.value
        }
        createDom('dropdownMenu')
        const layout = () => {
            localStorage.removeItem('token')
            userStore.token = ''
            userStore.user.isLogin = false
            delete axios.defaults.headers.common.Authorization
            createMessage('退出登录成功', 'success', 2000)
        }
        
        const dpRef = ref<null | HTMLElement>(null)
        const isOutside = useClickOutside(dpRef)
        watch(isOutside, () => {
            if (isOutside.value && isOpen.value){
            isOpen.value = false
        }
        })
        const router = useRouter()
        router.afterEach(() => {
            isOpen.value = false
        })
        return {
            toggleIsOpenFn,
            isOpen,
            dpRef,
            layout,
            userStore
        }
    },
})
</script>
<style lang="scss" scoped>
.dropdown-menu {
    width: 100px;
    height: auto;
    position: fixed;
    top: 60px;
    right: 0;
    z-index: 999;
}
</style>