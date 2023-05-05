interface CheckCondition {
    format?:string[];
    size?:number
}
type ErrorType = 'size' | 'format' | null
export function beforeUploadCheck(file: File, condition:CheckCondition){
    const { format, size } = condition
    const isValidFormat = format ? format.includes(file.type) : true
    const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
    let error: ErrorType = null
    if (!isValidFormat) {
        error = 'format'
    }
    if (!isValidSize) {
        error = 'size'
    }
    return {
        passed: isValidFormat && isValidSize,
        error
        }
}

// list 转 0bj
// interface testProps {
//     _id : string
//     name: string
// }
// const testData: testProps[] = [
//     {_id: '1', name: 'a'},
//     {_id: '2', name: 'b'},
//     {_id: '3', name: 'c'},
// ]
export function ArrToObj<T extends { _id: string; }>(arr: Array<T>){
    return arr.reduce((prev,  current) => {
        if (current._id) {
            prev[current._id] = current
        }
        return prev
    }, {} as {[key: string]: T})
}
// console.log(ArrToObj(testData));
export function ObjToArr<T>(obj: {[key: string] : T}){
    return Object.keys(obj).map(key => obj[key])
}
// console.log(ObjToArr(ArrToObj(testData)));

// 这是一个代理图片html img标签获得OSS的函数

export function getImgFromOSS(
    imgUrl:string, 
    imgDom:HTMLImageElement, 
    imgUrlDomain = 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/', 
    proxyDomain:'/GetImg/'){
    // 获取图片并转化为URL对象
    // 由于浏览器同源策略，后端也不是我家的，需要配置代理
    imgUrl = imgUrl.replace(imgUrlDomain, proxyDomain)
    fetch(imgUrl)
    .then(response => response.blob())
    .then(blob => URL.createObjectURL(blob))
    .then(url => {
    imgDom.src = url;
    })
    .catch(error => console.log(error));

}
