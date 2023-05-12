<template>


  <!-- <message  type="error" :message="userStore.error.message" v-if="userStore.error.status"></message> -->
  <Loader  v-if="userStore.isLoading" text="努力加载中"></Loader>
  <GlobalHeader :user=userStore.user :title="titledata"></GlobalHeader>
  <div class="main">
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary  mt-6">
        <small>
          <ul class="list-inline mb-0">
            <li class="list-inline-item">© 2023 者也专栏</li>
            <li class="list-inline-item">课程</li>
            <li class="list-inline-item">文档</li>
            <li class="list-inline-item">联系</li>
            <li class="list-inline-item">更多</li>
          </ul>
        </small>
    </footer>
  </div>

</template>


<script setup lang="ts">
// import createMessage from './components/CreateMessage'
// import message from './components/MessageItem.vue'
import Loader from './components/LoaderItem.vue'
import GlobalHeader from './components/GlobarHeader.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useUserStore } from './stores';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
const userStore = useUserStore()
const route = useRoute()
const cid = computed(() => route.params.id)
const pid = computed(() => route.params.pid)

const titledata = computed(() => {
  if (route.path == '/create') return {title: 'Create'}
  if (route.path == '/') return {title: '发现精彩'}
  return userStore.getcolumnsById(cid.value as string) || userStore.getPostById(pid.value as string)
})
console.log();
</script>

<style>
.main {
  padding: 0 5rem;
  padding-top: 90px;
  background-color: #ecf0f3 !important; 
}
body {
  background-color: #ecf0f3 !important; 
}
.circle {
    position: absolute;
    width: 40%;
    padding-top: 40%;
    border-radius: 50%;
    background-color: #ecf0f3;
    box-shadow: inset 8px 8px 12px #b8bec7, inset -8px -8px 12px #fff;
    /* bottom: -60%;
    left: -60%;
    transition: 1.25s; */
}
</style>