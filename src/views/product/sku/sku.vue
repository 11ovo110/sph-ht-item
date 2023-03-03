<template>
  <el-card>
    <el-table :data="skuList" border style="margin: 10px 0">
      <el-table-column label="序号" width="100" align="center" type="index"></el-table-column>
      <el-table-column label="名称" prop="skuName" width="150" ></el-table-column>
      <el-table-column label="描述" prop="skuDesc" width="150" ></el-table-column>
      <el-table-column label="默认图片" width="150" >
        <template #="{row, $index}">
            <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px"> 
        </template>
      </el-table-column>
      <el-table-column width="150"  label="重量(g)" prop="weight"></el-table-column>
      <el-table-column  width="150" label="价格(元)" prop="price"></el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template #="{row, $index}">
        <el-button @click="changeArrow(row)" :type="row.isSale ? 'info' : 'success'" :icon="row.isSale ? Bottom : Top"></el-button>
        <el-button type="primary" :icon="Edit"></el-button>
        <el-button type="info" :icon="InfoFilled"></el-button>
        <el-button type="danger" :icon="Delete" @click="deleteSku(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="current"
      v-model:page-size="limit"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="400"
      @size-change="sizeHandler"
      @current-change="getSkuList"
    />
  </el-card>
</template>

<script setup lang='ts'>
import { reqCancelSku, reqDeleteSku, reqgetAllSku, reqOnSaleSku } from "@/api/product/sku";
import { Bottom, Delete, Edit, InfoFilled, Top } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";


let skuList: any = ref([]);
let current: any = ref(1);
let limit: any = ref(10);
let total: any = ref(0);

const sizeHandler = () => {
  current.value = 1;
  getSkuList();
}

onMounted(() => {
getSkuList();
})

const getSkuList = async () => {
  let result: any = await reqgetAllSku(current.value, limit.value);
  skuList.value = result.records;
  total.value = result.total;
}

const changeArrow = async (row: any) => {
  row.isSale = row.isSale ? 0 : 1;
  if(row.isSale) {
    await reqOnSaleSku(row.id);
    ElMessage.success('上架成功');
  }else {
    await reqCancelSku(row.id);
    ElMessage.info('下架成功');
  }
  getSkuList();
}

const deleteSku = async (row: any) => {
try {
await reqDeleteSku(row.id);
ElMessage.success('删除成功');
}catch(e) {
  ElMessage.error('删除失败');
}
getSkuList();
}


</script>

<style scoped>

</style>