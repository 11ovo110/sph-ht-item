import { useUserInfoStore } from "@/stores/userInfo";
import pinia from '@/stores';

let userStore = useUserInfoStore(pinia);

export default function(app: any) {
  app.directive('has', {
    mounted(element: any, options: any) {
      if(!userStore.buttons.includes(options.value)) {
        element.parentNode.removeChild(element);
      }
    }
  })
}