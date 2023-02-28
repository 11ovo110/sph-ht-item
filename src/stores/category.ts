import { defineStore } from "pinia";
import { reqGetcategory1, reqGetcategory2, reqGetcategory3 } from "@/api/product/attr";

export const useCategoryStore = defineStore('categoryStore', {
  state: (): any => ({
    c1Id: '',
    c1Arr: [],
    c2Id: '',
    c2Arr: [],
    c3Id: '',
    c3Arr: [],
  }),
  actions: {
   async getCategory1() {
    let result = await reqGetcategory1();
    this.c1Arr = result;
    },
   async getCategory2() {
    this.c2Id = '';
    this.c3Arr = [];
    this.c3Id = '';
    let result = await reqGetcategory2(this.c1Id);
    this.c2Arr = result;
    },
   async getCategory3() {
    this.c3Id = '';
    let result = await reqGetcategory3(this.c2Id);
    this.c3Arr = result;
    },
  }
})