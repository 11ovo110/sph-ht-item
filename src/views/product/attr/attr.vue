<template>
  <Category></Category>
  <el-card style="margin-top: 20px">
    <el-button type="primary" :disabled="CategoryStore.c3Id ? false : true">添加平台属性</el-button>
    <el-form style="margin-top: 20px">
      <el-table :data="attrArr" style="width: 100%" border v-if="attrArr.length">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="attrName" label="属性名称" width="100" />
        <el-table-column label="属性值名称">
          <template #="{row, $index}">
              <el-tag v-for="value in row.attrValueList" :type="colorArr[Math.floor(Math.random() * 3 + 1)]" :key="value.id" style="margin: 0 5px">{{ value.valueName }}</el-tag>
          </template>
        </el-table-column>>
        <el-table-column label="操作" width="200">
          <template #="{row, $index}">
              <el-button type="warning" size="small" :icon="Edit"></el-button>
              <el-button type="danger" size="small" :icon="Delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty description="网络异常" v-else></el-empty>
    </el-form>
  </el-card>
</template>

<script setup lang='ts'>
import Category from "@/components/Category/index.vue";
import { useCategoryStore } from "@/stores/category";
import {ref, watch} from 'vue';
import { reqAttrInfo } from "@/api/product/attr";
import { Delete, Edit } from "@element-plus/icons-vue";

let CategoryStore = useCategoryStore();

let attrArr: any = ref([]);
let colorArr = ['success', 'info', 'primary', 'danger', 'warning'];


watch(() => CategoryStore.c3Id, async () => {
  attrArr.value = [];
  if(!CategoryStore.c3Id) return;
  let {c1Id, c2Id, c3Id} = CategoryStore;
  let result = await reqAttrInfo(c1Id, c2Id, c3Id);
  attrArr.value = result;
})

</script>

<style scoped>
</style>