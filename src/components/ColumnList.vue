<template lang="">
    <div class="row text-center">
        <div v-for="column in columnList" :key="column.id" class="col-4 mb-4">
            <div class="card h-100 shadow" >
                <div class="card-body text-cener">
                    <img :src="column.avatar" :alt="column.title" class=" rounded-circle border border-light w-25 my-3">                    <h5 class="card-title">{{column.title}}</h5>
                    <p class="card-text text-start">{{column.description}}</p>
                    <a href="#" class="btn btn-outline-primary">进入专栏 </a>
                </div>
            </div>
        </div>
    </div>   


</template>
<script lang="ts">

import { defineComponent, PropType } from 'vue'
import avatarNo from '../assets/column.jpg'
export interface ColumnProps {
        id:number,
        title:string,
        avatar?: string,
        description:string
    }


export default defineComponent({ 
    name: 'ColumnList',
    props:{
        list:{
            type: Array as PropType<ColumnProps[]> ,
            required:true
        }
    },

    setup(props) {
        const columnList = props.list.map(column => {
            if (!column.avatar){
                column.avatar = avatarNo
            }
            return column
        });
        return {
            columnList
        }
    }                   



    })
</script>
<style lang="">

</style>
