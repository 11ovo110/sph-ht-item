<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级标题">
        <el-select :disabled="flag ? true : false" v-model="attrStore.c1Id" @change="c1Handler">
          <el-option :value="c1.id" :label="c1.name" v-for="c1 in attrStore.c1Arr" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级标题">
        <el-select :disabled="flag ? true : false" v-model="attrStore.c2Id" @change="c2Handler">
          <el-option :value="c2.id" :label="c2.name" v-for="c2 in attrStore.c2Arr" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级标题">
        <el-select :disabled="flag ? true : false" v-model="attrStore.c3Id" >
          <el-option :value="c3.id" :label="c3.name" v-for="c3 in attrStore.c3Arr" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang='ts'>
import { onMounted, ref } from "vue";
import {useAttrStore} from '@/stores/attr';

let attrStore = useAttrStore();

defineProps(['flag']);

onMounted(() => {
  attrStore.getCategory1();
})

const c1Handler = () => {
  attrStore.getCategory2();
}

const c2Handler = () => {
  attrStore.getCategory3();
}


</script>

<style scoped>

</style>