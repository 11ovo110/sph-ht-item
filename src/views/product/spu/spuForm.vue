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
        <el-option :value="`${attr.name}:${attr.id}`" :label="attr.name" v-for="attr in unCheckAttr" :key="attr.id"></el-option>
      </el-select>
      <el-button type="primary" :icon="Plus" style="margin-left: 10px" @click="addSaleAttr">添加销售属性</el-button>
    </el-form-item>
    <el-table border style="margin: 20px 100px" :data="ownAttr">
      <el-table-column type="index" align="center" label="序号" width="100"></el-table-column>
      <el-table-column width="100" label="属性名" prop="saleAttrName"></el-table-column>
      <el-table-column label="属性值">
        <template #="{row, $index}">
            <el-tag closable @close="row.spuSaleAttrValueList.splice(index, 1)" style="margin: 0 5px" v-for="(sale, index) in row.spuSaleAttrValueList" :key="sale.id">{{ sale.saleAttrValueName }}</el-tag>
            <el-input :ref="(el) => inputRef[$index] = el" v-if="row.flag" size="small" style="display: inline;margin-right: 5px" v-model="row.saleAttrValueName" @blur="inputBlur(row)"></el-input>
            <el-button v-else @click="toEdit(row, $index)" type="primary" :icon="Plus"></el-button>
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

import { computed, nextTick, ref } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { ElMessage, type UploadProps, type UploadUserFile } from 'element-plus'
import { reqgetTrademarkList, reqgetAllAttr, reqgetSpuImageList, reqgetSaleAttr, reqSaveOrUpdateSpu } from '@/api/product/spu';

const dialogImageUrl: any = ref('')
const dialogVisible = ref(false)
const inputRef: any = ref([]);

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogVisible.value = true;
  dialogImageUrl.value = uploadFile.url;
}

const save = async () => {  
let spuSaleAttrList = ownAttr.value;
let imgArr = imgList.value.map((item: { name: any; response: { data: any; }; url: any; }) => ({
  imgName: item.name,
  imgUrl: item.response ? item.response.data : item.url
}))
spuParams.value.spuSaleAttrList = spuSaleAttrList;
spuParams.value.spuImageList = imgArr;
try {
  await reqSaveOrUpdateSpu(spuParams.value);
  $emit('getFlag', 0);
  ElMessage.success(spuParams.value.id ? '修改成功' : '添加成功');
}catch(e) {
  ElMessage.error(spuParams.value.id ? '修改失败' : '添加失败');
}
}

const cancel = () => {
$emit('getFlag', 0);
}

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

const AddSpuList = async (c3Id: number | string) => {
  imgList.value = [];
  ownAttr.value = [];
  spuParams.value = {
    spuName: "", //SPU名字
    tmId: "", //品牌ID
    description: "", //SPU描述
    spuImageList: [],
    spuSaleAttrList: [],
    category3Id: c3Id, //三级分类的的ID
  };
  let result = await reqgetTrademarkList();
  tradeList.value = result;
  let result1 = await reqgetAllAttr();
  attrList.value = result1;
}

// 定义发送请求的函数
const getSpuList = async (row: any) => {
  spuParams.value = row;
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

const unCheckAttr = computed(() => {
  return attrList.value.filter((item: { name: any; }) => ownAttr.value.every((attr: { saleAttrName: any; }) => attr.saleAttrName != item.name));
})

const title = computed(() => {
  return unCheckAttr.value.length ? `还有${unCheckAttr.value.length}未选择` : '无' 
})

const addAttr = ref('');

const addSaleAttr = () => {
  let [saleAttrName, baseSaleAttrId] = addAttr.value.split(':');
  let newAttr = {
    saleAttrName,
    baseSaleAttrId,
    spuSaleAttrValueList: []
  }
  ownAttr.value.push(newAttr);
  addAttr.value = '';
}

const inputBlur = (row: any) => {
let {baseSaleAttrId, saleAttrValueName} = row;
let newAttr = {
  baseSaleAttrId,
  saleAttrValueName
}
if(!saleAttrValueName.trim()) {
  ElMessage.warning('属性名不能为空');
  return;
}
let repeat = row.spuSaleAttrValueList.find((item: { saleAttrValueName: any; }) => item.saleAttrValueName == saleAttrValueName);
if(repeat) {
  ElMessage.warning('属性名不能重复');
  return;
}
row.spuSaleAttrValueList.push(newAttr);
row.flag = false;
}

const toEdit = (row: any, $index: any) => {
  row.flag = true;
  row.saleAttrValueName = '';
  nextTick(() => {
    inputRef.value[$index].focus();
  })
}

defineExpose({getSpuList, AddSpuList});

</script>

<style scoped>

</style>