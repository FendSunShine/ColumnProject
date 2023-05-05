<template>
  <div class="post-list">
    <div v-show="!(list && list.length > 0)"  >
  <div class="card mb-3 shadow-sm w-100">
      <div class="card-body">
        <div class="h4" style="width: 32%;background-color: #ccc;height: 31px;padding-left: 5px;margin-left: 15px;"></div>
        <div class="row my-3 align-items-center imgdiv ">
            <div class="imgDiv" style="width:25%;background-color: #ccc; height: 100px;"></div>
            <div style="width: 60%;">
            <p class="" style="height: 15px;background-color: #ccc;"></p>
            <p class="" style="height: 15px;background-color: #ccc;"></p>
            <p class="" style="height: 15px;background-color: #ccc;"></p>
            <p class="" style="height: 15px;background-color: #ccc;"></p>
            </div>
        </div>
        <span class="text-muted"></span>
      </div>
    </div>   <div class="card mb-3 shadow-sm w-100">
      <div class="card-body">
        <div class="h4" style="width: 32%;background-color: #ccc;height: 31px;padding-left: 5px;margin-left: 15px;"></div>
        <div class="row my-3 align-items-center imgdiv ">
            <div class="imgDiv" style="width:25%;background-color: #ccc; height: 100px;"></div>
            <div style="width: 60%;">
            <p class="" style="height: 15px;background-color: #ccc;"></p>
            <p class="" style="height: 15px;background-color: #ccc;"></p>
            <p class="" style="height: 15px;background-color: #ccc;"></p>
            <p class="" style="height: 15px;background-color: #ccc;"></p>
            </div>
        </div>
        <span class="text-muted"></span>
      </div>
    </div>   <div class="card mb-3 shadow-sm w-100">
      <div class="card-body">
        <div class="h4" style="width: 32%;background-color: #ccc;height: 31px;padding-left: 5px;margin-left: 15px;"></div>
        <div class="row my-3 align-items-center imgdiv ">
            <div class="imgDiv" style="width:25%;background-color: #ccc; height: 100px;"></div>
            <div style="width: 60%;">
            <p class="" style="height: 15px;background-color: #ccc;"></p>
            <p class="" style="height: 15px;background-color: #ccc;"></p>
            <p class="" style="height: 15px;background-color: #ccc;"></p>
            <p class="" style="height: 15px;background-color: #ccc;"></p>
            </div>
        </div>
        <span class="text-muted"></span>
      </div>
    </div>
    </div>
    <article v-for="post in list" :key="post.key" class="card mb-3 shadow-sm">
      <div class="card-body">
        <h4><router-link :to='{name:"postdetail", params:{pid: post._id}} '>{{post.title}}</router-link></h4>
        <div class="row my-3 align-items-center imgdiv">
            <img v-if="post.image && typeof post.image != 'string'" :src="post.image.url" alt="">
            <p>{{post.excerpt}}</p>
        </div>
        <span class="text-muted">{{post.createdAt}}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts" setup>
import { PropType, onMounted } from 'vue';
import {PostProps} from '../stores'
defineProps({
  list:{
    type:Array as PropType<PostProps[]>
  }
})
onMounted(() => {
  // scrollTo(0, 0)
  // TODO: MDN is supported, but ts is not available
  // @ts-ignore
  window.scrollTo({ top: 0, left: 0, behavior: "instant" }); 

})
</script>

<style lang='scss' scoped>
@media screen and (max-width:1040px) {
  .imgdiv {
    flex-direction: column !important;
  }
}
.card {
  background-color: #f5f9fb;

}
.post-list h4 a {
  text-decoration: none;
  color:#1a1a1a;
}
.post-list h4 a:hover {
  color:#0d6efd;
}
.imgdiv {
  display:flex;
  justify-content: space-around;
  p {
    flex:1;
  }
}
img {
  width: 300px;
}
</style>
