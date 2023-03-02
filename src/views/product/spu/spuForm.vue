<template>
  <el-form>
    <el-form-item label="SPU名称">
      <el-input placeholder="请您输入SPU名称" v-model="spuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select placeholder="请您选择品牌" v-model="spuParams.tmId">
        <el-option :value="trade.id" v-for="trade in tradeList" :key="trade.id" :label="trade.tmName"></el-option>
      </el-select> 
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="请您输入描述" v-model="spuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
      <el-upload
    v-model:file-list="imgList"
    action="/app-dev/admin/product/fileUpload"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" style="width: 80%"/>
  </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select :placeholder="title" v-model="addAttr">
        <el-option :value="`${attr.id}:${attr.name}`" :label="attr.name" v-for="attr in unSaleattr" :key="attr.id"></el-option>
      </el-select>
      <el-button type="primary" :icon="Plus" style="margin-left: 10px" :disabled="addAttr ? false : true" @click="addSaleAttr">添加销售属性</el-button>
    </el-form-item>
    <el-table border style="margin: 20px 100px" :data="ownAttr">
      <el-table-column type="index" align="center" label="序号" width="100"></el-table-column>
      <el-table-column width="100" label="属性名" prop="saleAttrName"></el-table-column>
      <el-table-column label="属性值">
        <template #="{row, $index}">
            <el-tag @close="row.spuSaleAttrValueList.splice(index, 1)" closable v-for="(value, index) in row.spuSaleAttrValueList" :key="value.id" style="margin: 0 5px">{{ value.saleAttrValueName }}</el-tag>
            <el-input :ref="(el) => inputRef[$index] = el" v-if="row.flag" v-model="row.saleAttrValueName" style="display: inline" size="small" @blur="inputBlur(row)"></el-input>
            <el-button type="primary" :icon="Plus" @click="toEdit(row, $index)" size="small"></el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #="{row, $index}">
            <el-button :icon="Delete" type="danger" @click="ownAttr.splice($index, 1)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-left: 100px">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-form>
</template>

<script setup lang='ts'>

import { computed, nextTick, ref } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import { Delete, Plus } from '@element-plus/icons-vue'
import { ElMessage, type UploadProps, type UploadUserFile } from 'element-plus'
import { reqgetTrademarkList, reqgetAllAttr, reqgetSpuImageList, reqgetSaleAttr, reqAddOrUpdateSpuInfo } from '@/api/product/spu';

const dialogImageUrl: any = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogVisible.value = true;
  dialogImageUrl.value = uploadFile.url;
}

const save = async () => {
let spuImageList = imgList.value.map((item: { name: any; response: { data: any; }; url: any; }) => {
  return {
    imgName: item.name,
    imgUrl: item.response ? item.response.data : item.url
  }
})
spuParams.value.spuImageList = spuImageList;
spuParams.value.spuSaleAttrList = ownAttr;
try {
  await reqAddOrUpdateSpuInfo(spuParams.value);
  console.log(11);
  ElMessage.success(spuParams.value.id ? '修改成功' : '添加成功');
  $emit('getFlag', 0);
}catch(e) {
  ElMessage.error(spuParams.value.id ? '修改失败' : '添加失败');
}
}

const cancel = () => {
$emit('getFlag', 0);
}

const addSaleAttr = () => {
  let [baseSaleAttrId, saleAttrName] = addAttr.value.split(':');
  let newAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
  ownAttr.value.push(newAttr);
  addAttr.value = '';
}

// 计算出未选择的
const unSaleattr = computed(() => {
  return attrList.value.filter((item: { name: any; }) => {
    return ownAttr.value.every((attr: { saleAttrName: any; }) => attr.saleAttrName != item.name)
  })
})

// 选择框新增属性值
let addAttr = ref(''); 

// 设置选择框的文本
let title = computed(() => {
  return unSaleattr.value.length ? `还有${unSaleattr.value.length}未选择` : '无';
})

// 所有的品牌
let tradeList: any = ref([]);
// 所有的属性
let attrList: any = ref([]);
// 所有的照片
let imgList: any = ref([]);
// 自己的属性
let ownAttr: any = ref([]);
// 定义完整的数据
let spuParams: any = ref([]);

let $emit = defineEmits(['getFlag']);

// 定义发送请求的函数
const getSpuList = async (row: any) => {
  spuParams.value = cloneDeep(row);
  let {id} = row; 
  let result = await reqgetTrademarkList();
  tradeList.value = result;
  let result1 = await reqgetAllAttr();
  attrList.value = result1;
  let result2: any = await reqgetSpuImageList(id);
  imgList.value = result2.map((item: { imgName: any; imgUrl: any; }) => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  let result3 = await reqgetSaleAttr(id);
  ownAttr.value = result3;
}

let inputRef: any = ref([]);
// 点击tag编辑的回调
const toEdit = (row: any, $index: any) => {
row.flag = true;
row.saleAttrValueName = '';
nextTick(() => {
  inputRef.value[$index].focus();
})
}

// 文本框失去焦点
const inputBlur = (row: any) => {
let {saleAttrValueName, baseSaleAttrId} = row;
if(!saleAttrValueName.trim()) {
  ElMessage.warning('属性值不能为空');
  return;
}
// 判断有没有重复
let repeat = row.spuSaleAttrValueList.find((item: { saleAttrValueName: any; }) => item.saleAttrValueName == saleAttrValueName);
if(repeat) {
  ElMessage.warning('属性值不能重复');
  return;
}
// 生成一个新的属性值
let newAttrValue = {
  saleAttrValueName,
  baseSaleAttrId
}
row.spuSaleAttrValueList.push(newAttrValue);
row.flag = false;
}

const addNewSpu = async (c3Id: any) => {
  imgList.value = [];
  ownAttr.value = [];
  spuParams.value = {
    spuName: "", //SPU名字
    tmId: "", //品牌ID
    description: "", //SPU描述
    spuImageList: [],
    spuSaleAttrList: [],
    category3Id: 0, //三级分类的的ID
  }
  spuParams.value.category3Id = c3Id;
  let result = await reqgetTrademarkList();
  tradeList.value = result;
  let result1 = await reqgetAllAttr();
  attrList.value = result1;
}

defineExpose({getSpuList, addNewSpu});

</script>

<style scoped>

</style>