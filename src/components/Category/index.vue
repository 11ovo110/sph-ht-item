<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级标题">
        <el-select :disabled="flag ? true : false" v-model="categoryStore.c1Id" @change="c1Handler">
          <el-option :value="c1.id" :label="c1.name" v-for="c1 in categoryStore.c1Arr" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级标题">
        <el-select :disabled="flag ? true : false" v-model="categoryStore.c2Id" @change="c2Handler">
          <el-option :value="c2.id" :label="c2.name" v-for="c2 in categoryStore.c2Arr" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级标题">
        <el-select :disabled="flag ? true : false" v-model="categoryStore.c3Id">
          <el-option :value="c3.id" :label="c3.name" v-for="c3 in categoryStore.c3Arr" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang='ts'>
import { onMounted, ref } from "vue";
import { useCategoryStore } from "@/stores/category";

let categoryStore = useCategoryStore();

defineProps(['flag']);

onMounted(() => {
  categoryStore.getCategory1();
})

const c1Handler = () => {
  categoryStore.getCategory2();
}

const c2Handler = () => {
  categoryStore.getCategory3();
}

</script>

<style scoped>

</style>