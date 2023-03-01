<template>
  <el-form>
    <el-form-item label="SPU名称">
      <el-input placeholder="请您输入SPU名称" v-model="spuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select placeholder="请您选择品牌" v-model="spuParams.tmId">
        <el-option :value="trade.id" v-for="trade in tradeList" :key="trade.id">{{trade.tmName}}</el-option>
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
      <el-select placeholder="未选择">
        <el-option :value="attr.name" :label="attr.name" v-for="attr in attrList" :key="attr.id"></el-option>
      </el-select>
      <el-button type="primary" :icon="Plus" style="margin-left: 10px">添加销售属性</el-button>
    </el-form-item>
    <el-table border style="margin: 20px 100px">
      <el-table-column type="index" align="center" label="序号" width="100"></el-table-column>
      <el-table-column width="100" label="属性名"></el-table-column>
      <el-table-column label="属性值"></el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>
    <div style="margin-left: 100px">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-form>
</template>

<script setup lang='ts'>

import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { reqgetTrademarkList, reqgetAllAttr, reqgetSpuImageList, reqgetSaleAttr } from '@/api/product/spu';

const dialogImageUrl: any = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogVisible.value = true;
  dialogImageUrl.value = uploadFile.url;
}

const save = () => {
$emit('getFlag', 0);
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

defineExpose({getSpuList});

</script>

<style scoped>

</style>