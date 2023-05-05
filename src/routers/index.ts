import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeItem.vue'
import Login from '../views/LoginItem.vue'
import Column from '../views/ColumnDetails.vue'
import SignUp from '../views/SignUp.vue'
import PostDetail from '../views/PostDetails.vue'
import { useUserStore } from '../stores'
import axios from 'axios'
import createMessage from '../components/CreateMessage'
const routerHistory = createWebHistory()

const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta:{
                redirectAlreadyLogin: true
            }
        },
        {
            path:'/column/:id',
            name:'column',
            component:Column
        },
        {
            path: '/create',
            name: 'create',
            component: () => import('../views/CreatePost.vue'),
            meta:{
                requireLogin: true
            }
        },
        {
            path:'/signup',
            name:'signup',
            component:SignUp
        },
        {
            path:'/postdetail/:pid',
            name:'postdetail',
            component:PostDetail
        }
    ]
})
router.beforeEach((to) => {
    const userStore = useUserStore()
    const {redirectAlreadyLogin, requireLogin} = to.meta
    if(userStore.user.isLogin){
        if(redirectAlreadyLogin){
            return {name:'home'}
        } else return true
    } else {
        if (userStore.token) {
            axios.defaults.headers.common.Authorization = `Bearer ${userStore.token}`
            userStore.fetchCurrentUser().then(() => {
                if(redirectAlreadyLogin){
                    return {name:'home'}
                } else return true
            }).catch((err) => {
                createMessage(err, 'error', 1000)
                // token出现问题
                localStorage.removeItem('token')
                userStore.token = ''
            })
        } else {
            if(requireLogin){
                return {name:'login'}
            } else return true
            
        }
    }
})
export default router