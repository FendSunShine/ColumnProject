<template>
  <teleport to="#dark">
  <div
    v-if="isShow"
    class="d-flex justify-content-center align-items-center h-100 w-100 loading-container"
    :style="{backgroundColor: background || ''}"
  >
    <div   class="loading-content">
      <div     class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ text || 'loading'}}</span>
      </div>
      <p v-if="text" class="text-primary small">{{text}}</p>
    </div>
  </div>
</teleport>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import createDom from '../hooks/createDom';
import { ref } from 'vue';

const props =  defineProps({
  background: {
    type: String,
    default: 'rgba(255,255,255,0.5)'
  },
  text: String,
  isShow:{
    type:Boolean,
    default:true
  },
  notShowPath:{
    type:Array,
    default:() => ['column', 'create']
  }
})
const isShow = ref(props.isShow)
// 判断是否是notShowPath所在的路由
const  route = useRoute()
if (route.path ){
  if (props.notShowPath.includes(route.path.split('/')[1])){
    isShow.value = false
  }
}

// 创建dark节点
createDom('dark')
</script>

<style scoped>
.loading-container {
  /* background: rgba(255, 255, 255, .5); */
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.loading-content {
  text-align: center;
}
</style>
