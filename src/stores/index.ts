//引入createPinia方法:用于创建大仓库
import { createPinia } from 'pinia';
//创建大仓库
const pinia = createPinia();
//默认对外暴露
export default pinia;