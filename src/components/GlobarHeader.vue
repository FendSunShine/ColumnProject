<template>
    <div class="head" >
        <div class="headscroll" ref="header">
            <nav class="navbar  navbar-dark  text-center shadow-sm  px-4  " style="box-sizing: border-box">
                <router-link class=" left navbar-brand text-primary  border-title" to="/">首页</router-link>
                <div class=" center navbar-brand text-center text-primary border-title" to="/">者也专栏</div>
                <ul v-if="!user.isLogin" class=" right list-inline mb-0">
                    <li class="list-inline-item"><router-link  to="/login" class="btn btn-outline-light my-2 ">登陆</router-link></li>
                    <li class="list-inline-item"><router-link  to="/signup" class="btn btn-outline-light my-2 ">注册</router-link></li>
                </ul>
                <ul v-else  class=" right list-inline mb-0">
                    <DropDown :title="`你好！${user.nickName? user.nickName: ''}`"></DropDown>
                </ul>
            </nav>

            <nav class="navbar  navbar-dark      shadow-sm  px-4 " >
                <router-link class=" left navbar-brand text-primary border-title" to="/">首页</router-link>
                <div v-if="!title" class="center navbar-brand text-primary border-title"  to="/">者也专栏</div>
                <div v-else class="center text-center">
                    <router-link  class=" navbar-brand text-primary border-title" to="/" >{{ title.title }}</router-link>
                    <img :src="title?.avatar?.url" alt="">
                </div>
                <ul v-if="!user.isLogin" class=" right list-inline mb-0">
                    <li class="list-inline-item"><router-link  to="/login" class="btn btn-outline-light my-2 ">登陆</router-link></li>
                    <li class="list-inline-item "><router-link to="/signup" class="btn btn-outline-light my-2 ">注册</router-link></li>
                </ul>
                <ul v-else  class=" right list-inline mb-0">
                    <DropDown  :title="`你好！${user.nickName? user.nickName: ''}`"></DropDown>
                </ul>
            </nav>
        </div>
    </div>
</template>   

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue';
import DropDown from './DropDown.vue'
import { UserProps} from '../stores'

export default defineComponent({
    name: 'GlobarHeader',
    components:{DropDown},
    props: {
        user: {
            type: Object as PropType<UserProps>,
            required: true 
        },
        title: Object
    },
    setup() {
        const header = ref<HTMLDivElement | null>(null)
        onMounted(() => {
            let prevScrollPos = window.scrollY
            window.addEventListener('scroll', () => {
            const currentScrollPos = window.scrollY
            if ((prevScrollPos < currentScrollPos) && header.value) {
                // 向下滚动
                header.value.classList.add('scroll-down')
                header.value.classList.remove('scroll-up')
            } else if (header.value) {
                // 向上滚动
                header.value.classList.add('scroll-up')
                header.value.classList.remove('scroll-down')
            }
            prevScrollPos = currentScrollPos
})
        })
        return {
            header
        }
        
    }
})



</script>
<style scoped lang="scss"> 
.btn.btn-outline-light.my-2 {
    background-color: #007bff;
}
.navbar {
    width: 100%;
    .left {
        position: absolute;
        left: 1%;
    }
    .center {
        user-select: none; /* Chrome/Opera/Edge */
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    .right {
        position: absolute;
        right:1%;
    }
}
/* 设置head头部定位 */
.head {
    z-index: 5;
    width: 100%;
    height: 70px;
    overflow: hidden;
    position: fixed;
    top: 0;
    right: 0;
    
}


/* 设置单个样式 */
.navbar.navbar-dark {
    box-sizing: border-box;
    height:70px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
/* 使用径向渐变设置背景图像，从透明到白色，第一个颜色值为 transparent（透明），位置为 1px，
   第二个颜色值为白色，位置也为 1px */
    background-image:radial-gradient(transparent 1px,#ecf0f3 1px);

    /* 设置背景尺寸为 4px * 4px */
    background-size:4px 4px;

    /* 设置背景滤镜，饱和度值为 50%，模糊半径为 4px */
    backdrop-filter:saturate(50%)blur(4px)
}

.headscroll.scroll-down {
  /* 向下滚动时的样式 */
    transform: translateY(-70px);
    transition: transform 0.3s ease-in-out;

}

.headscroll.scroll-up {
  /* 向上滚动时的样式 */
    transform: translateY(0);
    transition: transform 0.3s ease-in-out;

}
.border-title {
    background-color: #ecf0f3;
    border-radius: 25%;
}

</style>