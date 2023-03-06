//此项目采用:vue3 + pinia + element-plus + vue-router
//vue3提供组合式API函数:用于创建应用实例(app)
import { createApp } from 'vue'
import App from './App.vue'
//创建应用实例
const app = createApp(App);
//集中式管理状态容器:拥有三个小仓库
import pinia from './stores'

//完成引入element-plusUI组件库[完整引入]
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
//vue-router配置项目的路由
import router from './router'
//引入样式
import './styles/index.scss'
//引入ELSvg函数
import ElSvg from './components/SvgIcon/ElSvg'
//引入全局组件 category
import Category from './components/Category/index.vue';
import isHas from '@/utils/directive';
//函数调用传递app
ElSvg(app)
isHas(app);

import './permission'

app.use(pinia).use(router).use(ElementPlus, {locale: zhCn}).mount('#app')

app.component('Category', Category);
