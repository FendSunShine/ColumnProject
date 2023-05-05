import { defineStore } from "pinia";
import axios from "axios";
import { ArrToObj, ObjToArr } from "../../helper";
import { LoadParams } from "../hooks/useLoadMore";
export interface avatarProps {
    _id?:string,
    url?: string
    }
export interface ColumnProps {
    _id: string;
    title: string;
    avatar?: avatarProps;
    description: string;
    }
export interface PostProps {
    _id?: string;
    title: string;
    excerpt?: string;
    image?: avatarProps | string;
    createdAt?: string;
    column: string;
    isHTML?:boolean
    key?:number
    author?:string | UserProps
    content:string
}
export interface UserProps {
    isLogin: boolean
    avatar?:avatarProps
    email?:string
    decription?:string
    nickName?: string
    _id?:string
    column?: string
}
interface errorProps {
    status: boolean
    message?:string
}
export interface ListObjProps<P> {
    [key: string] : P
}
interface loadedColumnsItem {
    ColumnID: string;
    total: number;
    currentPage: number
}
interface GlobalDataProps {
    error:errorProps;
    columns: {data:ListObjProps<ColumnProps>, currentPage: number, MaxGetColumnNum:number};
    posts: {data:ListObjProps<PostProps>, loadedColumns:ListObjProps<loadedColumnsItem>};
    user: UserProps;
    isLoading: boolean;
    token: string;
}
export interface payloadProps {
    email: string;
    password: string
}

export const useUserStore =  defineStore('user', {
    state:():GlobalDataProps => {
        return {
            error:{status:false},
            columns:{data: {}, currentPage: 0, MaxGetColumnNum:0},
            posts:{data:{}, loadedColumns: {}},
            user:{isLogin: false},
            isLoading: false,
            token:localStorage.getItem('token') || ''
        }
    },
    
    getters:{
        getColumns(state){
            return ObjToArr(state.columns.data)
        },
        getcolumnsById: (state) => {
            return (userId:string) =>  state.columns.data[userId]
            
        },
        getPostsByCid:(state) => {
            return (Cid: string) => ObjToArr(state.posts.data).filter(f => f.column == Cid)
        },
        getPostById:(state) => {
            return (userId: string) => state.posts.data[userId]
        }
    },
    actions: {
        // 发布帖子
        async createPost(newPost: PostProps){
            if (newPost._id){
                this.posts.data[newPost._id] = newPost
            }
            await axios.post('/posts',newPost)
        },
        // 修改帖子
        async updataPost(pid: string, newPost:PostProps){
            await  axios.patch(`/posts/${pid}`, newPost)
            this.posts.data[pid] = {...this.posts.data[pid], ...newPost}
        },
        async getMaxGetColumnNum(pageSize = '6'){
            if (!this.columns.MaxGetColumnNum){
                this.columns.MaxGetColumnNum = await axios.get(`/columns`).
                then(res => Math.ceil((res.data.data.count / Number(pageSize))))
            }
            return this.columns.MaxGetColumnNum
        },
        // 刷新columns
        async fetchColumns(MaxGetColumnNum:number, currentPage = '1', pageSize = '6' ){
            if (this.columns.currentPage < +currentPage){
                this.columns.currentPage = +currentPage
                if (Number(currentPage) <= MaxGetColumnNum){
                    const columns = await axios.get(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`)
                    this.columns.data = {...this.columns.data, ...ArrToObj(columns.data.data.list)} 
                }
                return (Number(currentPage) < MaxGetColumnNum)
            } else return false

        },
                // 设置作者的信息 - 在clumns.data里面
        /*  
            _id: string;
            title: string;
            avatar?: avatarProps;
            description: string;
        */
        async setLoginColumn(cid:string){
            // cid就用的是专栏的cid
            
            if (cid && !Object.prototype.hasOwnProperty.call(this.columns.data, cid)){
                const loginColumnData: ColumnProps = {  
                    _id : cid,
                    title: 'this is 泰罗奥特曼',
                    avatar: {
                        url:'/avatar.jpg'
                    },
                    description: '分析前端有趣知识以及小案例'
                }
                
                this.columns.data[cid] = loginColumnData
            }
        },
        // 刷新posts
        async fetchPosts(cid:string, params : {currentPage? : number, pageSize?:number, isForceFlush?:boolean}){
            let currentPage,pageSize
            if (typeof cid == 'object') {
                const cidAs = (cid as LoadParams)
                currentPage = cidAs.currentPage
                pageSize = cidAs.pageSize
                cid = cidAs.cid || cid
            } else {
                ({currentPage = 1, pageSize = 3} = params)
            }
            if (!this.posts.loadedColumns[cid] || this.posts.loadedColumns[cid].currentPage < currentPage || (params.isForceFlush)){
                const {data} =  await axios.get(`/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`)
                const rawData = data.data
                this.posts.loadedColumns[cid] = {
                    ColumnID: cid,
                    total: rawData.count,
                    currentPage
                }
                // 组合数据
                if (currentPage == 1){
                    // 这一步是个找了2小时的bug
                    /* 
                    首先我的列表名单需求是创建新的之后回到列表，新的是出于第一个。
                    列表功能支持：长列表刷新，所以每次刷新会在列表未添加新刷新的数据
                    因为修改后，进入需要刷新，所以刷新的参数就改成了{currentPage: 1}
                    所以只要是第一次刷新，拿到的新数据就要放到pinia数据list的前段
                    这样不仅满足原始第一次刷新，也满足修改后的刷新
                    如下行代码
                    */
                    this.posts.data = {...(ArrToObj(rawData.list) as ListObjProps<PostProps>),...this.posts.data}
                } else {
                    this.posts.data = {...this.posts.data, ...(ArrToObj(rawData.list) as ListObjProps<PostProps>)}

                }
                
        }
        },
        // 获得post细节
        async fetchPost(pid:string){
            // 如果posts不存在该pid,或者posts.pid不存在content
            // 这句话简直完美,先判断第一个是否存在，不存在就为1,就不会判断第二个了就不会报错
            if (!this.posts.data[pid] || !this.posts.data[pid].content){
                const {data} = await axios.get('/posts/'+pid)
                // // 删除本来postID
                // this.posts = this.posts.filter(data => data._id !== pid)
                // // 增加详细PostId数据
                // this.posts.push(data.data)
                this.posts.data[pid] = data.data
                // return data.data
            }
            return this.posts.data[pid]
        },
        // 删除post
        async deletePostById(pid:string){   
            delete this.posts.data[pid]
            return await axios.delete('/posts/'+pid)
        },
        // 登录
        async login(payload: payloadProps){
            const token = await axios.post('/user/login', payload);
            this.token = token.data.data.token;
            // 持久化token
            localStorage.setItem('token', this.token);
            axios.defaults.headers.common.Authorization = `Bearer ${this.token}`;
        },
        async fetchCurrentUser(){
            const userData = await axios.get('/user/current')
            this.user = {...userData.data.data, isLogin:true}
            return userData
        },
        // 登录并拿到user数据
        async loginAndFetchCurrentUser(payload: payloadProps){

                await this.login(payload); // 登录
                return await this.fetchCurrentUser(); // 获取当前用户信息
            
        },
        
    }
})