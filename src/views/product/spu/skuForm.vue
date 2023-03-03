<template>
  <el-form label-width="80">
    <el-form-item label="sku名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input placeholder="重量(克)" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="sku描述">
      <el-input
        placeholder="sku描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline label-width="80">
        <el-form-item
          :label="attr.attrName"
          v-for="attr in allAttr"
          :key="attr.id"
        >
          <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
            <el-option
              :value="`${attr.id}:${value.id}`"
              v-for="value in attr.attrValueList"
              :key="value.id"
              :label="value.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline>
        <el-form-item
          :label="sale.saleAttrName"
          v-for="sale in saleArr"
          :key="sale.id"
        >
          <el-select placeholder="请选择" v-model="sale.saleIdAndValueId">
            <el-option
              :value="`${sale.baseSaleAttrId}:${value.id}`"
              v-for="value in sale.spuSaleAttrValueList"
              :key="value.id"
              :label="value.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column width="80" type="selection"></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button
              @click="changeDefaultImg(row)"
              :type="row.flag ? 'primary' : 'warning'"
              >{{ row.flag ? "默认图片" : "设置图片" }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts'>
import {
  reqGetAllAttrInfo,
  reqgetSaleAttr,
  reqgetSpuImageList,
  reqSaveNewSku,
} from "@/api/product/spu";
import { ElMessage } from "element-plus";
import { nextTick, ref } from "vue";

// 定义取消的回调
const cancel = () => {
  $emit("getFlag", 0);
};

// 获取表格实例
let table = ref();

let allAttr: any = ref([]);
let saleArr: any = ref([]);
let imgArr: any = ref([]);
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

const initAddSpu = async (c1Id: any, c2Id: any, row: any) => {
  skuParams.value = {
    category3Id: "", //三级分类的ID
    spuId: "", //已有SPU的ID
    tmId: "", //品牌的ID
    skuName: "", //新增SKU的名字
    price: "", //SKU的价格
    weight: "", //SKU重量
    skuDesc: "", //sku的描述
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuDefaultImg: "",
  };
  allAttr.value = [];
  saleArr.value = [];
  imgArr.value = [];
  skuParams.value.category3Id = row.category3Id;
  skuParams.value.spuId = row.id;
  skuParams.value.tmId = row.tmId;
  let result = await reqGetAllAttrInfo(c1Id, c2Id, row.category3Id);
  let result1 = await reqgetSpuImageList(row.id);
  let result2 = await reqgetSaleAttr(row.id);
  allAttr.value = result;
  saleArr.value = result2;
  imgArr.value = result1;
  if (!imgArr.value.length) return;
  nextTick(() => {
    table.value.toggleRowSelection(imgArr.value[0], true);
  });
  imgArr.value.forEach((item: { flag: boolean }) => (item.flag = false));
  imgArr.value[0].flag = true;
  skuParams.value.skuDefaultImg = imgArr.value[0].imgUrl;
};

const changeDefaultImg = (row: any) => {
  imgArr.value.forEach((item: { flag: boolean }) => {
    item.flag = false;
    table.value.toggleRowSelection(item, false);
  });
  table.value.toggleRowSelection(row, true);
  row.flag = true;
};

const save = async () => {
  // 平台属性参数整理
  let skuAttrValueList = allAttr.value.reduce((pre: any, cur: any) => {
    if (cur.attrIdAndValueId) {
      let [attrId, valueId] = cur.attrIdAndValueId.split(":");
      let newObj = {
        attrId,
        valueId,
      };
      pre.push(newObj);
    }
    return pre;
  }, []);
  // 销售属性参数整理
  let skuSaleAttrValueList = saleArr.value.reduce((pre: any, cur: any) => {
    if (cur.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = cur.saleIdAndValueId.split(":");
      let newObj = {
        saleAttrId,
        saleAttrValueId,
      };
      pre.push(newObj);
    }
    return pre;
  }, []);
  skuParams.value.skuAttrValueList = skuAttrValueList;
  skuParams.value.skuSaleAttrValueList = skuSaleAttrValueList;
  try {
    await reqSaveNewSku(skuParams.value);
    ElMessage.success("添加成功");
    $emit("getFlag", 0);
  } catch (e) {
    ElMessage.success("添加失败");
  }
};

defineExpose({ initAddSpu });
let $emit = defineEmits(["getFlag"]);
</script>

<style scoped>
</style>