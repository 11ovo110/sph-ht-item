<template>
  <el-form>
    <el-form-item label="sku名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input placeholder="重量(克)" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="sku描述">
      <el-input placeholder="sku描述" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline>
        <el-form-item :label="attr.attrName" v-for="attr in attrArr" :key="attr.id">
          <el-select placeholder="请选择" v-model="attr.attrIdAndvalueId">
            <el-option :value="`${attr.id}:${value.id}`" :label="value.valueName" v-for="value in attr.attrValueList" :key="value.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline>
        <el-form-item :label="sale.saleAttrName" v-for="sale in saleAttr" :key="sale.baseSaleAttrId">
          <el-select placeholder="请选择" v-model="sale.saleIdAndValueId">
            <el-option :value="`${sale.baseSaleAttrId}:${value.id}`" :label="value.saleAttrValueName" v-for="value in sale.spuSaleAttrValueList" :key="value.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table ref="table" border style="margin: 20px 0" :data="imgList">
        <el-table-column type="selection" width="100px"></el-table-column>
        <el-table-column label="图片">
          <template #="{row, $index}">
              <img :src="row.imgUrl" alt="" style="width: 100px;height: 100px">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{row, $index}">
            <el-button :type="row.flag ? 'primary' : 'success'" @click="changeDefault(row)">默认图片</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts'>
import {
  reqaddSku,
  reqgetAttrInfo,
  reqgetSaleAttr,
  reqgetSpuImageList,
} from "@/api/product/spu";
import { ElMessage } from "element-plus";
import { nextTick, ref } from "vue";

let $emit = defineEmits(["getFlag"]);
let imgList: any = ref([]);
let saleAttr: any = ref([]);
let attrArr: any = ref([]);
let skuParams: any = ref({
  category3Id: "", //三级分类的ID
  spuId: "", //已有SPU的ID
  tmId: "", //品牌的ID
  skuName: "", //新增SKU的名字
  price: "", //SKU的价格
  weight: "", //SKU重量
  skuDesc: "", //sku的描述
  skuAttrValueList: [
    //收集新增SKU的平台属性与属性值的数据
    // {
    //   attrId: 0,
    //   valueId: 0,
    // },
  ],
  skuSaleAttrValueList: [
    //收集新增SKU的销售属性与属性值的数据
    // {
    //   saleAttrId: 0,
    //   saleAttrValueId: 0,
    // },
  ],
  skuDefaultImg: "", //收集新增SKU的默认图片地址
});

const table = ref();

const initSkuInfo = async (c1Id: any, c2Id: any, row: any) => {
  skuParams.value = {
  category3Id: '', //三级分类的ID
  spuId: '', //已有SPU的ID
  tmId: '', //品牌的ID
  skuName: "", //新增SKU的名字
  price: "", //SKU的价格
  weight: "", //SKU重量
  skuDesc: "", //sku的描述
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: "", //收集新增SKU的默认图片地址
}
  skuParams.value.category3Id = row.category3Id;
  skuParams.value.spuId = row.id;
  skuParams.value.tmId = row.tmId;
  let result = await reqgetSpuImageList(row.id);
  let result1 = await reqgetSaleAttr(row.id);
  let result2 = await reqgetAttrInfo(c1Id, c2Id, row.category3Id);
  imgList.value = result;
  saleAttr.value = result1;
  attrArr.value = result2;
  imgList.value.forEach((item: { flag: boolean; }) => item.flag = false);
  imgList.value[0].flag = true;
  nextTick(() => {
    table.value.toggleRowSelection(imgList.value[0], true)
  })
  skuParams.value.skuDefaultImg = imgList.value[0].imgUrl;
};

const changeDefault = (row: any) => {
  imgList.value.forEach((item: { flag: boolean; }) => {
    item.flag = false;
    table.value.toggleRowSelection(item, false);
  })
  row.flag = true;
  table.value.toggleRowSelection(row, true);
  skuParams.value.skuDefaultImg = row.imgUrl;
}

const save = async () => {
  let skuAttrValueList = attrArr.value.reduce((pre: any, cur: any) => {    
    if(cur.attrIdAndvalueId) { 
      let [attrId, valueId] = cur.attrIdAndvalueId.split(':');
      let newObj = {attrId, valueId};
      pre.push(newObj);
    }
    return pre;
  }, [])
  let skuSaleAttrValueList = attrArr.value.reduce((pre: any, cur: any) => {
    if(cur.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = cur.saleIdAndValueId.split(':');
      let newObj = {saleAttrId, saleAttrValueId};
      pre.push(newObj);
    }
    return pre;
  }, [])  
  
  skuParams.value.skuAttrValueList = skuAttrValueList;
  skuParams.value.skuSaleAttrValueList = skuSaleAttrValueList;
  
  try {
    await reqaddSku(skuParams.value);
    ElMessage.success('添加成功');
  }catch(e) {
    ElMessage.error('添加失败');
  }
  $emit("getFlag", 0);
};

const cancel = () => {
  $emit("getFlag", 0);
};

defineExpose({ initSkuInfo });
</script>

<style scoped>
</style>