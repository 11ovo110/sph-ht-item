<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select v-model="CategoryStore.c1Id" placeholder="请选择" @change="c1Handler">
          <el-option :value="c1.id" :label="c1.name" v-for="c1 in CategoryStore.c1Arr" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" placeholder="请选择">
        <el-select v-model="CategoryStore.c2Id" placeholder="请选择" @change="c2Handler">
          <el-option :value="c2.id" :label="c2.name" v-for="c2 in CategoryStore.c2Arr" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" placeholder="请选择">
        <el-select v-model="CategoryStore.c3Id" placeholder="请选择">
          <el-option :value="c3.id" :label="c3.name" v-for="c3 in CategoryStore.c3Arr" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang='ts'>
import { ref, onMounted } from "vue";
import {useCategoryStore} from '@/stores/category';

let CategoryStore = useCategoryStore();

onMounted(() => {
  CategoryStore.getCategory1();
})

let c1Handler = () => {
  CategoryStore.getCategory2();
}

let c2Handler = () => {
  CategoryStore.getCategory3();
}


</script>

<style scoped>

</style>