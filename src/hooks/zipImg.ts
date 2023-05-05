// 压缩图片
  // TODO:第三方库，没办法
  // @ts-ignore
import ImageCompressor from '../assets/zipimg.js' 
export default function  zipImg(file:File, SuccessFun:(result: Blob) => void)
{
    const options = {
        file: file,
        // 压缩前回调
        beforeCompress: function (result: Blob ) {
            // 
            
            // 
        },
        // 压缩成功回调
        success: SuccessFun
        };
        new ImageCompressor(options);
}