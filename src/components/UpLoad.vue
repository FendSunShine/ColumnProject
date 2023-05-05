<template>
    <div class="file-upload">
        <div class="file-upload-container"  ref = 'dropZone' @click.prevent="triggerUpload" v-bind="$attrs">
            <slot v-if="fileStatus == 'loading'" name="loading">
                <button class="btn btn-primary" disabled>正在上传中...</button>
            </slot>
            <slot v-else-if="fileStatus === 'success'" 
            name="uploaded"
            :updataFile="updataFile"
            >
                <button class="btn btn-primary">上传成功</button>
            </slot>
            <slot v-else name="default">
                <button class="btn btn-primary">点击上传</button>
            </slot>

        </div>
        <hr>
        <input type="file" 
        ref="fileInput" 
        class="file-input d-none"
        @change="handleFileChange"
        >
    </div>
</template>
<script lang="ts">
// 使用普通的 <script> 来声明选项
export default {
    inheritAttrs: false
}
</script>
<script setup lang="ts">
import axios from 'axios';
import { PropType, computed, onMounted, ref, watch } from 'vue';
import createMessage from './CreateMessage';
import zipImg from  '../hooks/zipImg'
type UploadStatus = 'ready'| 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean;
const emits = defineEmits(['file-uploaded'])
const props = defineProps({
    action:{
        type:String,
        require:true
    },
    beforeUpload:{
        type:Function as PropType<CheckFunction>
    },
    uploadData:{
        type:Object
    }
})
const fileInput = ref<null | HTMLInputElement>(null)
const fileStatus = ref<UploadStatus>('ready')
const updataFile = ref()
const dropZone = ref<HTMLElement | null>(null)
// 实现拖拽文件
onMounted(() => {
function handleDragOver(event:Event) {
    event.preventDefault();
    dropZone.value && dropZone.value.classList.add("drag-over");
}

function handleDragLeave(event:Event) {
    event.preventDefault();
    dropZone.value && dropZone.value.classList.remove("drag-over");
}

function handleDrop(event:any) {
    event.preventDefault();
    handleFileChange(event)
    dropZone.value && dropZone.value.classList.remove("drag-over");
    // var files = event.dataTransfer.files;
    // // 在这里处理上传的文件
    // 
}

if (dropZone.value) {
    // 处理拖拽上传的相关事件
    dropZone.value.addEventListener("dragover", handleDragOver); // 当文件拖到上传区域时触发该事件
    dropZone.value.addEventListener("dragleave", handleDragLeave); // 当鼠标离开上传区域时触发该事件
    dropZone.value.addEventListener("drop", handleDrop); // 当鼠标拖动文件并释放鼠标时触发该事件
}
})


// 如果uploadData发生改变并且有值，则代表在改写阶段
watch(() => props.uploadData, () => {
    fileStatus.value = 'success'
    updataFile.value = computed(() => props.uploadData)
})

const triggerUpload = () => {
    fileInput.value && fileInput.value.click()

}
const handleFileChange = (e: Event | DragEvent) => {
    fileStatus.value = 'loading' 
    if (e.target){
        let files;
        if ((e.target as HTMLInputElement).files){
            files = (e.target as HTMLInputElement).files
        } else if(e instanceof DragEvent && e.dataTransfer && e.dataTransfer.files){
            files = e.dataTransfer.files;
        }
        // files && zipImg(files[0])
        const formData = new FormData()
        if (files){
            // loading之前验证
            // 判断格式
            if(props.beforeUpload){
                const res = props.beforeUpload(files[0])
                if (!res) return fileStatus.value = 'error' 
            }
            // 判断大小,太大就压缩
            // const file =  files && zipImg(files[0])

            zipImg(files[0], (zipDoneFile:Blob) => {
                
                const newFile = new File([zipDoneFile], 'filename.jpg', { type: zipDoneFile.type });
                formData.append(newFile.name, newFile)
                axios.post(props.action as string, formData, {
                    headers:{
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    // 清楚虚线
                    dropZone.value && dropZone.value.classList.remove("upload-zone");
                    fileStatus.value = 'success'
                    
                    updataFile.value = res.data.data
                    emits('file-uploaded', res.data)
                }).catch((err) => {fileStatus.value = 'error';createMessage(err, 'error', 2000)})
                .finally(() => {
                    if(fileInput.value){
                        // 把拿到的文件名设置为空
                        fileInput.value.value = ''
                    }
                })
            })
        }
        // if (files){
        //     // loading之前验证
        //     if(props.beforeUpload){
        //         const res = props.beforeUpload(files[0])
        //         if (!res) return fileStatus.value = 'error' 
        //     }
        //     formData.append(files[0]?.name, files[0])
        //     axios.post(props.action as string, formData, {
        //         headers:{
        //             'Content-Type': 'multipart/form-data'
        //         }
        //     }).then(res => {
        //         // 清楚虚线
        //         dropZone.value && dropZone.value.classList.remove("upload-zone");
        //         fileStatus.value = 'success'
        //         
        //         updataFile.value = res.data.data
        //         emits('file-uploaded', res.data)
        //     }).catch((err) => {fileStatus.value = 'error';createMessage(err, 'error', 2000)})
        //     .finally(() => {
        //         if(fileInput.value){
        //             // 把拿到的文件名设置为空
        //             fileInput.value.value = ''
        //         }
        //     })
        // }
}
}

</script>

<style scoped>
.upload-zone {
    border: 5px dashed #ccc;
    border-radius: 5px;
}
.upload-zone.drag-over {
            border-color: #0069d9;
            background-color: rgba(0, 105, 217, 0.1);
        }
</style>