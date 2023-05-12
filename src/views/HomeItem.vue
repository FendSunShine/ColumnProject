<template>
    <div class="home-page" style="position:relative;">
            <div class="circle"></div>
            <div class="circle circle_two"></div>
            <section class="py-5 text-center container">
            <div class="row py-lg-5">
                <div class="col-lg-6 col-md-8 mx-auto">
                <img ref="moveImg" src="../assets/callout.svg" alt="callout" class="w-50"/>
                <h2 class="font-weight-light">随心写作，自由表达</h2>
                <span ref="gotoWrite">
                    <router-link :to="{name:'create'}"  class=" btn btn-primary my-2">开始写文章</router-link>
                </span>
                </div>
            </div>
            </section>
            <div 
            ref = 'findWonderful'
            class="font-weight-bold text-center" 
            style="font-size: 16px;transform: translateY(0);"
            >发现精彩</div>
            <column-list :list='columnListData'></column-list>
            <button
            class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-block"
            @click="loadMore"
            v-if="isLoading"
            >
            加载更多
            </button>
            <hr>
    </div>
    
</template>
<script setup lang="ts">
import { HandleImgUrl } from '../../helper';
import {throttle} from 'lodash'
import {  computed, onBeforeMount, onUnmounted, ref } from 'vue';
import ColumnList from '../components/ColumnList.vue'
import { useUserStore } from '../stores';
import { nextTick } from 'vue';
const currentPage = ref(2)
const userStore = useUserStore()
const isLoading = ref(true)
const columnListData = computed(() => userStore.getColumns)
const  MaxGetColumnNum = ref(1)
const gotoWrite = ref<null | HTMLElement>(null)
const moveImg = ref<null | HTMLElement>(null)
// 做图片动画
nextTick(() => {
    if (gotoWrite.value ){
    
    gotoWrite.value.addEventListener('mouseover', function() {
        moveImg.value && moveImg.value.classList.add('shake');
    });

    gotoWrite.value.addEventListener('mouseout', function() {
        moveImg.value && moveImg.value.classList.remove('shake');
    });
}
})

userStore.getMaxGetColumnNum().then(num => {
    MaxGetColumnNum.value = num
});
const findWonderful = ref<null | HTMLElement>(null);
// 添加滚动条事件
const handleScroll = throttle(() => {
    let Y = window.scrollY
    if (Y < 800) {
        const fontSize = 32 +  Y / 30
        if (findWonderful.value){
            findWonderful.value.style['fontSize'] = fontSize + 'px'
            findWonderful.value.style['transform'] = 'translateY(-' + Y / 18 + 'px)'
        }
    }
}, 50)
window.addEventListener('scroll', handleScroll)
    
const loadMore = () => {
    userStore.fetchColumns(MaxGetColumnNum.value, String(currentPage.value)).then(isLoad => isLoading.value = isLoad)  
    currentPage.value++
}
onBeforeMount(() => {
    userStore.fetchColumns(MaxGetColumnNum.value)  
})
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.circle {
    left: -20%;
    top: -6%;
}
.circle_two {
    /* width: 300px;
    height: 300px; */
    right: -30%;
    left: initial;
    top: 9%;
}
.btn.btn-primary.my-2 {
    transition: transform 0.2s ease-in-out;
}
.btn.btn-primary.my-2:hover{
    transform: scale(1.2);
}

.shake {
    animation: shake 0.5s infinite;
    }

@keyframes shake {
    0% { transform: translate(0, 0); }
    25% { transform: translate(2px, -2px); }
    50% { transform: translate(-2px, 2px); }
    75% { transform: translate(-2px, -2px); }
    100% { transform: translate(2px, 2px); }
}

</style>