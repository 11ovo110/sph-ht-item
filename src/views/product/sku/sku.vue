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
        <el-button type="info" :icon="InfoFilled" @click="changeFlag(row)"></el-button>
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
      :total="total"
      @size-change="sizeHandler"
      @current-change="getSkuList"
    />
    <el-drawer v-model="flag" title="查看商品详情">
    <el-row :gutter="10">
      <el-col :span="8">名称</el-col>
      <el-col :span="16">{{skuInfo.skuName}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">描述</el-col>
      <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">价格</el-col>
      <el-col :span="16">{{skuInfo.price}}</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">平台属性</el-col>
      <el-col :span="16">
      <el-tag type="warning" v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{ item.valueName }}</el-tag>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">销售属性</el-col>
      <el-col :span="16">
        <el-tag type="success" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">{{ item.saleAttrValueName }}</el-tag>
      </el-col>
    </el-row>
    <el-row :gutter="10">
    <el-col :span="8">商品图片</el-col>
    <el-col :span="16">
      <el-carousel indicator-position="outside">
    <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
      <img :src="item.imgUrl" alt="" style="width: 100%;height: 100%">
    </el-carousel-item>
  </el-carousel>
    </el-col>
    </el-row>
    </el-drawer>
  </el-card>
</template>

<script setup lang='ts'>
import { reqCancelSku, reqDeleteSku, reqgetAllSku, reqgetSku, reqOnSaleSku } from "@/api/product/sku";
import { Bottom, Delete, Edit, InfoFilled, Top } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";


let skuList: any = ref([]);
let current: any = ref(1);
let limit: any = ref(10);
let total: any = ref(0);
let flag: any = ref(false);

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

const skuInfo: any = ref({});

const changeFlag = async (row: any) => {
  flag.value = true;
  let result = await reqgetSku(row.id);
  skuInfo.value = result;
}

</script>
<style scoped lang="less">
/**
深度选择器: 1.原生css    >>>    2.less   /deep/     3.sass     ::v-deep
**/
:deep(.el-carousel__button)  {
  color: #475669;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.el-carousel__item h3 {
  display: flex;
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>