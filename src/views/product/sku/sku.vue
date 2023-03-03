<template>
  <el-card>
    <el-table :data="allSku">
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="名称" prop="skuName" width="250"></el-table-column>
      <el-table-column label="描述" prop="skuDesc" width="250"></el-table-column>
      <el-table-column label="默认图片" width="250">
        <template #="{row, $index}">
            <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px">
        </template>
      </el-table-column>
      <el-table-column label="重量(g)" prop="weight" width="250"></el-table-column>
      <el-table-column label="价格(元)" prop="price" width="250"></el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template #="{row, $index}">
          <el-button @click="changeArrow(row)" :icon="row.isSale ? Bottom : Top" :type="row.isSale ? 'info' : 'success'"></el-button>
          <el-button :icon="Edit" type="primary"></el-button>
          <el-button :icon="InfoFilled" type="info"></el-button>
          <el-button :icon="Delete" type="danger" @click="deleteSku(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="current"
      v-model:page-size="limit"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="sizeHandler"
      @current-change="getAllSku"
    />
  </el-card>
</template>

<script setup lang='ts'>
import { reqAllSku, reqCancelSku, reqdeleteSku, reqSaleSku } from '@/api/product/sku';
import { Delete, Edit, InfoFilled, Top, Bottom } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

let allSku = ref([]);
let current = ref(1);
let limit = ref(10);
let total = ref(0);

const sizeHandler = () => {
  current.value = 1;
  getAllSku();
}

onMounted(() => {
  getAllSku();
})

const getAllSku = async () => {
  let result: any = await reqAllSku(current.value, limit.value);
  allSku.value = result.records;
  total.value = result.total;
}

const deleteSku = async (row: any) => {
await reqdeleteSku(row.id);
getAllSku();
}

const changeArrow = async (row: any) => {
row.isSale = row.isSale ? 0 : 1;
if(row.isSale) {
  await reqSaleSku(row.id);
  ElMessage.success('上架成功');
}else {
  await reqCancelSku(row.id);
  ElMessage.info('下架成功');
}
getAllSku();
}

</script>

<style scoped>

</style>