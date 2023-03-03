<template>
  <el-form>
    <el-form-item label="sku名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input placeholder="重量(克)" type="number" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="sku描述">
      <el-input placeholder="sku描述" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline>
        <el-form-item :label="attr.attrName" v-for="attr in attrArr" :key="attr.id">
          <el-select placeholder="请选择" v-model="attr.attrIdAnditemId">
            <el-option :value="`${attr.id}:${item.id}`" v-for="item in attr.attrValueList" :key="item.id" :label="item.valueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline>
        <el-form-item :label="sale.saleAttrName" v-for="sale in saleArr" :key="sale.baseSaleAttrId">
          <el-select placeholder="请选择" v-model="sale.saleIdAndvalueId">
            <el-option :value="`${sale.baseSaleAttrId}:${item.id}`" :label="item.saleAttrValueName" v-for="item in sale.spuSaleAttrValueList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table ref="table" style="margin: 10px 0" :data="imgArr" border>
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="图片">
          <template #="{row, $index}">
              <img :src="row.imgUrl" alt="" style="width: 100px;height: 100px">
          </template>
        </el-table-column>
        <el-table-column label="名称"></el-table-column>
        <el-table-column label="操作">
          <template #="{row, $index}">
            <el-button @click="changeDefault(row)" :type="row.flag ? 'primary' : 'success'">{{row.flag ? '默认图片' : '设置默认'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts'>
import { reqGetAttrList, reqgetSaleAttr, reqgetSpuImageList, reqSaveSku } from "@/api/product/spu";
import { ElMessage } from "element-plus";
import { nextTick, ref } from "vue";

let imgArr: any = ref([]);
let attrArr: any = ref([]);
let saleArr: any = ref([]);
let table: any = ref();
let skuParams = ref({
  category3Id: "", //三级分类的ID
  spuId: "", //已有SPU的ID
  tmId: "", //品牌的ID
  skuName: "", //新增SKU的名字
  price: "", //SKU的价格
  weight: "", //SKU重量
  skuDesc: "", //sku的描述
  skuAttrValueList: [
    //收集新增SKU的平台属性与属性值的数据
    {
      attrId: 0,
      valueId: 0,
    },
  ],
  skuSaleAttrValueList: [
    //收集新增SKU的销售属性与属性值的数据
    {
      saleAttrId: 0,
      saleAttrValueId: 0,
    },
  ],
  skuDefaultImg: "", //收集新增SKU的默认图片地址
})

const initaddSku = async (c1Id: any, c2Id: any, row: any) => {
  skuParams.value = {
  category3Id: row.category3Id, //三级分类的ID
  spuId: row.id, //已有SPU的ID
  tmId: row.tmId, //品牌的ID
  skuName: "", //新增SKU的名字
  price: "", //SKU的价格
  weight: "", //SKU重量
  skuDesc: "", //sku的描述
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: "", //收集新增SKU的默认图片地址
};
  let result = await reqgetSpuImageList(row.id);
  let result1 = await reqgetSaleAttr(row.id);
  let result2 = await reqGetAttrList(c1Id, c2Id, row.category3Id);
  imgArr.value = result;
  attrArr.value = result2;
  saleArr.value = result1;
  imgArr.value.forEach((item: { flag: boolean; }) => item.flag = false);
  imgArr.value[0].flag = true;
  nextTick(() => {
    table.value.toggleRowSelection(imgArr.value[0], true);
  })
  skuParams.value.skuDefaultImg = imgArr.value[0].imgUrl;
};

const changeDefault = (row: any) => {
  imgArr.value.forEach((item: { flag: boolean; }) => {
    item.flag = false
    table.value.toggleRowSelection(item, false);
  });
  row.flag = true;
  nextTick(() => {
    table.value.toggleRowSelection(row, true);
  })
  skuParams.value.skuDefaultImg = row.imgUrl;
}

const save = async () => {
let skuAttrValueList = attrArr.value.reduce((pre: any, cur: any) => {
  if(cur.attrIdAnditemId) {
    let [attrId, valueId] = cur.attrIdAnditemId.split(':');
    let newObj = {attrId, valueId};
    pre.push(newObj);
  }
  return pre;
}, [])

let skuSaleAttrValueList = saleArr.value.reduce((pre: any, cur: any) => {
  if(cur.attrIdAnditemId) {
    let [saleAttrId, saleAttrValueId] = cur.saleIdAndvalueId.split(':');
    let newObj = {saleAttrId, saleAttrValueId};
    pre.push(newObj);
  }
  return pre;
}, [])

skuParams.value.skuAttrValueList = skuAttrValueList;
skuParams.value.skuSaleAttrValueList = skuSaleAttrValueList;
try {
  console.log(skuParams.value);
  
  await reqSaveSku(skuParams.value);
  ElMessage.success('添加成功');
}catch(e) {
  ElMessage.error('添加失败');
}
$emit('getFlag', 0);

}


const cancel = () => {
$emit('getFlag', 0);
}

let $emit = defineEmits(['getFlag'])
defineExpose({ initaddSku });
</script>

<style scoped>
</style>