import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx";
// https://vitejs.dev/config/
export default defineConfig({ 
    plugins: [vue(),vueJsx(),],
    build: {
        rollupOptions: {
            external: ['js-image-compressor']
        },
        terserOptions: { 
            compress: { 
                drop_console: true,
                drop_debugger: true
            } 
            } 
    },
    server: {
        // port: 4000, // 设置服务启动端口号
        open: true, // 设置服务启动时是否自动打开浏览器
        cors: true, // 允许跨域
        // 设置代理，根据我们项目实际情况配置
        proxy: {
          '/apiTest': { //apiTest是自行设置的请求前缀，按照这个来匹配请求，有这个字段的请求，就会进到代理来
            target: 'http://api.vikingship.xyz/api/',
            changeOrigin: true, //是否跨域
            rewrite: (path) => path.replace('/apiTest', '') //重写匹配的字段，如果不需要放在请求路径上，可以重写为""
            }
        },
        
    }

})
