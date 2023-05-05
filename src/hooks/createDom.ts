import { onUnmounted } from "vue"

export default function createDom(DomID:string, DomType = 'div'){
    let node = document.getElementById(DomID);
    if (!node) {
        node = document.createElement(DomType)
        node.id = DomID
        document.body.appendChild(node)
    }
    onUnmounted(() => {
        if (node  && document.body.contains(node)){
            document.body.removeChild(node)
        }
    })
}