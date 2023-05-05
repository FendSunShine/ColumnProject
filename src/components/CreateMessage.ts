import { h, render} from 'vue'
import Message from './MessageItem.vue'
export type MessageType = 'success' | 'error' | 'default'

// 用jsx表达组件，组件就是配置
// const message1 = {
//     render(){
//         return (<h2>error</h2>)
//     }
// }



const createMessage = (message: string, type: MessageType, timeout?: number) => {
    const messageVnode = h(Message, {
        message,
        type
    })
    const mountNode = document.createElement('div')
    mountNode.id = 'message'
    document.body.appendChild(mountNode)
    render(messageVnode, mountNode)
    const destory = () => {
        render(null, mountNode)
        document.body.removeChild(mountNode)
    }
    if (timeout) {
        setTimeout(() => {
        destory()
        }, timeout)
    } else {
        setTimeout(() => {
            destory()
            }, 2000)
    }
    return {destory}
}

export default createMessage
