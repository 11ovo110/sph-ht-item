<template>
 <el-card>
  <el-table :data="skuList">
    <el-table-column label="序号" width="100" type="index" align="center"></el-table-column>
    <el-table-column label="名称" width="200" prop="skuName"></el-table-column>
    <el-table-column label="描述" width="200" prop="skuDesc"></el-table-column>
    <el-table-column label="默认图片" width="200">
      <template #="{row, $index}">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px">
      </template>
    </el-table-column>
    <el-table-column label="重量" width="200" prop="weight"></el-table-column>
    <el-table-column label="价格" width="200" prop="price"></el-table-column>
    <el-table-column label="操作" width="260">
      <template #="{row, $index}">
          <el-button @click="changeArrow(row)" :type="row.isSale ? 'info' : 'success'" size="small" :icon="row.isSale ? Bottom : Top"></el-button>
          <el-button type="primary" size="small" :icon="Edit"></el-button>
          <el-button type="success" size="small" :icon="InfoFilled"></el-button>
          <el-button type="success" size="small" :icon="Delete" @click="deleteSku(row)"></el-button>
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
      @current-change="getSkuList"
    />
 </el-card>
</template>

<script setup lang='ts'>
import { reqCancelSku, reqdeleteSku, reqgetSkuList, reqOnSaleSku } from '@/api/product/sku';
import { Delete, Edit, InfoFilled, Bottom, Top } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

let skuList = ref([]);
let current = ref(1);
let limit = ref(10);
let total = ref(0);

onMounted(() => {
getSkuList();
})

const getSkuList = async () => {
let result: any = await reqgetSkuList(current.value, limit.value);
skuList.value = result.records;
total.value = result.total;
}

const sizeHandler = () => {
  current.value = 1;
  getSkuList();
}

const changeArrow = async (row: any) => {
  row.isSale = row.isSale ? 0 : 1;
  if(row.isSale) {
    await reqOnSaleSku(row.id);
    ElMessage.success('上架成功')
  }else {
    await reqCancelSku(row.id);
    ElMessage.success('下架成功');
  }
}

const deleteSku = async (row: any) => {
  await reqdeleteSku(row.id);
  ElMessage.success('删除成功');
  getSkuList();
}

</script>

<style scoped>

</style>