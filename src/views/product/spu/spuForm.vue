<template>
  <el-form>
    <el-form-item label="SPU名称">
      <el-input placeholder="请您输入SPU名称" v-model="spuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select placeholder="请您选择品牌" v-model="spuParams.tmId">
        <el-option :value="trade.id" :label="trade.name" v-for="trade in allTrademark" :key="trade.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input placeholder="请您输入描述" v-model="spuParams.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
      <el-upload
    v-model:file-list="imgList"
    action="/app-dev/admin/product/fileUpload"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select placeholder="未选择">
        <el-option value="1" label="1"></el-option>
      </el-select>
      <el-button type="primary" :icon="Plus" style="margin-left: 10px">添加销售属性</el-button>
    </el-form-item>
     <el-table border style="margin: 10px 100px">
    <el-table-column label="序号" width="100" align="center" type="index"></el-table-column>
    <el-table-column label="属性名" width="100"></el-table-column>
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
import { Plus } from '@element-plus/icons-vue';
import { ref } from 'vue'

import type { UploadProps, UploadUserFile } from 'element-plus'
import { reqAllattrList, reqAllTrademark, reqgetimgList, reqOwnattrList } from '@/api/product/spu';

const dialogImageUrl: any = ref('')
const dialogVisible = ref(false)

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile);
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

const save = () => {
$emit('changeFlag', 0);
}

const cancel = () => {
$emit('changeFlag', 0);
}

let spuParams: any = ref([]);
let allTrademark: any = ref([]);
let imgList: any = ref([]);
let allAttrList: any = ref([]);
let ownattrlist: any = ref([]);

const getSpuList = async (row: any) => {
  spuParams.value = row;
  let result: any = await reqAllattrList();
  let result1: any = await reqAllTrademark();
  let result2: any = await reqgetimgList(row.id);
  let result3: any = await reqOwnattrList(row.id);
  allAttrList.value = result;
  imgList.value = result2.map((item: { imgName: any; imgUrl: any; }) => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  allTrademark.value = result1;
  ownattrlist.value = result3;
}

let $emit = defineEmits(['changeFlag']);
defineExpose({getSpuList});

</script>

<style scoped>

</style>