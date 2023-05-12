<template>
    <div class="user-profile-component">
        <div class="d-flex align-items-center">
            <img  :src="HandleImgUrl(fitUrl)" style="width: 100px; height: 100px;" :alt="user.nickName" class="rounded-circle  img-thumbnail">
            <div class="detail ml-2">
                <h4 class="d-block mb-0">{{user.nickName}}</h4>
                <span  class="text-truncate text-muted d-block">{{user.decription}}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { UserProps } from '../stores';
import { HandleImgUrl } from '../../helper';
const props = defineProps({
    user:{
        type: Object as PropType<UserProps>,
        required: true    
    }
})
const fitUrl = computed(() => {
    return props.user.avatar ? props.user.avatar.url : '/avatar.jpg'
})
</script>

<!-- <style scoped>
img#avator {
    width: 50px !important;
    height: 50px !important;
    /* border: 1px solid #ccc;
    border-radius: 50px; */
}
</style> -->