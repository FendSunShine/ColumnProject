import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routers'
import { createPinia } from 'pinia'
import axios from 'axios'
import { useUserStore } from './stores'
import 'easymde/dist/easymde.min.css'
const app = createApp(App)
console.log(app);
const pinia = createPinia()
app.use(pinia)
app.use(router)
const userStore = useUserStore()
axios.defaults.baseURL = '/apiTest' 
axios.interceptors.request.use(config => {
    userStore.isLoading = true
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(config);
        }, 100);
    });
}, (err) => {
    console.log('requestErr:', err);
})
axios.interceptors.response.use(config => {
    setTimeout(() => {
        userStore.isLoading = false
    }, 50);
    return config
}, err => {
    const error = err.response.data.error
    const detail = err.response.data.detail
    userStore.isLoading = false
    return error=="Validation Failed" ? Promise.reject(detail) : Promise.reject(error)
})

app.mount('#app')
