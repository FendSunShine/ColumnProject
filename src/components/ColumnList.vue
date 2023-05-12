<template lang="">
    <div class="row text-center">
        <div v-for="column in columnList" :key="column._id" class="col-4 mb-4">
            <div class="card h-100" >
                <div class="card-body text-cener">
                    <img :src="HandleImgUrl(column.avatar.url)"
                    :ref="'img' + column._id" 
                    :alt="column.title" class=" rounded-circle border border-light my-3">                    <h5 class="card-title">{{column.title}}</h5>
                    <p class="card-text text-start">{{column.description}}</p>
                    <div class='intoColumn'>
                        <router-link :to='`/column/${column._id}`' class="btn btn-outline-primary">进入专栏 </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>   


</template>
<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import avatarNo from '../assets/column.jpg'
import {ColumnProps} from '../stores'
import {HandleImgUrl} from '../../helper'
export default defineComponent({ 
    name: 'ColumnList',
    props:{
        list:{
            type: Array as PropType<ColumnProps[]> ,
            required:true
        }
    },
    setup(props) {
        const columnList = computed(() => {
            return  props.list.map(column => {
                    if (column.avatar && !column.avatar.url){
                        column.avatar.url = avatarNo
                    } else {
                        column.avatar && (column.avatar.url += '?x-oss-process=image/resize,m_pad,w_50,h50')
                    }
                    return column
                    })
        })
        // zhic
        return {
            columnList,
            HandleImgUrl
        }
    }                   



    })
</script>
<style  scoped lang="scss">
.circle {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background-color: #ecf0f3;
    box-shadow: inset 8px 8px 12px #b8bec7, inset -8px -8px 12px #fff;
    bottom: -60%;
    left: -60%;
    transition: 1.25s;
}

/* 专栏定位 */
.card-body {
    position: relative;
    min-height: 300px;
    .intoColumn {
        margin-top: 2rem;
        transition: transform 0.2s ease-in-out;

    }
    .intoColumn:hover {
        transform: scale(0.985);
    }
}
.card-body img {
    width: 50px;
    height: 50px;
}
.card {
    box-shadow: 0 0 2px #bab9b9;
    background-color:#f0f4f7;
}
.card:hover{
    animation: shadow-drop-center 1s  forwards;
    
    /* background-color: pink; */
}
/* 点击卡片出现阴影 */
@keyframes shadow-drop-center{
    0%{box-shadow:0 0 2px #bab9b9}
    100%{   box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #f9f9f9};
}

</style>