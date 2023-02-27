import type { App} from 'vue'
//引入element-plus提供全部的图标组件
import * as svg from '@element-plus/icons-vue';
import SvgIcon from '@/components/SvgIcon/index.vue'

export default function (app: App) {
  app.component('svg-icon', SvgIcon)

  const icons = svg as any;
  
	for (const i in icons) {
		app.component(`ele-${icons[i].name}`, icons[i]);
	}
}



