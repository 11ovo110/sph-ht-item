<template>
  <Category :flag="flag"></Category>
  <el-card style="margin-top: 20px">
    <div v-show="!flag">
      <el-button type="primary" :icon="Plus" @click="addSpu">添加SPU</el-button>
    <el-table border :data="records" style="margin: 20px 0">
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="SPU名称" prop="spuName"></el-table-column>
      <el-table-column label="SPU描述" prop="description"></el-table-column>
      <el-table-column label="操作">
        <template #="{row, $index}">
          <el-button type="primary" :icon="Plus"></el-button>
          <el-button type="warning" :icon="Edit" @click="updateAttr(row)"></el-button>
          <el-button type="info" :icon="InfoFilled"></el-button>
          <el-button type="danger" :icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="current"
      v-model:page-size="limit"
      :page-sizes="[3,5,7,9]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="sizeHandler"
      @current-change="getAttrInfo"
    />
    </div>
    <sku-form v-show="flag == 1" ref="spu" @changeFlag="flag = $event"></sku-form>
  </el-card>
</template>

<script setup lang='ts'>
import { Delete, Edit, InfoFilled, Plus } from '@element-plus/icons-vue';
import { onUnmounted, ref, watch } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { reqgetAttrInfo } from '@/api/product/spu';
import skuForm from './skuForm.vue';

let categoryStore = useCategoryStore();
let current = ref(1);
let total = ref(0);
let limit = ref(3);
let records = ref([]);
let flag = ref(0);
let spu = ref();

watch(() => categoryStore.c3Id, () => {
  records.value = [];
  if(categoryStore.c3Id) {
    getAttrInfo();
  }
})

const getAttrInfo = async () => {
  let result: any = await reqgetAttrInfo(current.value, limit.value, categoryStore.c3Id);
  records.value = result.records;
  total.value = result.total;
}

const sizeHandler = () => {
  current.value = 1;
  getAttrInfo();
}

onUnmounted(() => {
  categoryStore.c1Id = '';
  categoryStore.c1Arr = '';
  categoryStore.c2Id = '';
  categoryStore.c2Arr = '';
  categoryStore.c3Id = '';
  categoryStore.c3Arr = '';
})

const addSpu = () => {
  flag.value = 1;
}

const updateAttr = (row: any) => {
  flag.value = 1;
  spu.value.getSpuList(row);
}

</script>

<style scoped>

</style>
