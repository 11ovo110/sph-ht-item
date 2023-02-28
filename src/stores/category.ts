import { reqCategory1, reqCategory2, reqCategory3 } from "@/api/product/attr";
import { defineStore } from "pinia";

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
    let result = await reqCategory1();
    this.c1Arr = result;
    },
   async getCategory2() {
    this.c2Id = '';
    this.c3Arr = [];
    this.c3Id = '';
    let result = await reqCategory2(this.c1Id);
    this.c2Arr = result;
    },
   async getCategory3() {
    this.c3Id = '';
    let result = await reqCategory3(this.c2Id);
    this.c3Arr = result;
    },
  }
})