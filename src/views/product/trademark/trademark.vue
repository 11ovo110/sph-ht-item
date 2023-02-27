<template>
  <div>
    <el-card shadow="hover">
      <el-button type="primary" :icon="Plus" @click="addTrademark">添加品牌</el-button>
      <el-button type="warning" @click="SendExcel">导出excel</el-button>
      <el-table border size="large" style="margin: 10px 0" :data="record">
        <el-table-column
          prop="date"
          label="序号"
          width="90"
          align="center"
          type="index"
        />
        <el-table-column prop="tmName" label="品牌名称" />
        <el-table-column label="品牌LOGO">
          <template #="{ row, $index }">
            <img
              :src="row.logoUrl"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="品牌操作">
          <template #="{row, $index}">
          <el-button type="primary" :icon="Edit" @click="edit(row)"></el-button>
          <el-button type="danger" :icon="Delete" @click="DeleteTradeMark(row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="current"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :small="false"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="sizeHandler"
        @current-change="getTradeMark"
      />
      <el-dialog v-model="dialogFormVisible" :title="addSearchParams.id ? '修改品牌' : '添加品牌'">
        <el-form label-width="100px" :model="addSearchParams" :rules="rules" ref="formRef">
          <el-form-item label="品牌名称" prop="tmName">
            <el-input placeholder="请输入品牌名称" v-model="addSearchParams.tmName"/>
          </el-form-item>
          <el-form-item label="品牌LOGO" prop="logoUrl">
            <el-upload
              class="avatar-uploader"
              action="/app-dev/admin/product/fileUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="addSearchParams.logoUrl" :src="addSearchParams.logoUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="add">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import { Delete, Plus, Edit } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { reqAddTradeMark, reqTradeMark, reqDeleteTradeMark } from "@/api/product/trademark";
import * as XLSX from "xlsx";
import { ElMessage } from "element-plus";
import { nextTick } from "process";

let limit = ref(3);         // 设置每页的数量
let current = ref(1);       // 设置当前的页数
let record = ref([]);       // 当前页数的数据
let total = ref(0);        // 数据总条数
// 设置表单的显示与隐藏
let dialogFormVisible = ref(false);
// 获取form实例
let formRef = ref();

// 收集表单数据
let addSearchParams: any = reactive({
  tmName: '',
  logoUrl: ''
})

// 获取品牌的数据
let getTradeMark = async () => {
  let result: any = await reqTradeMark(current.value, limit.value);
  total.value = result.total;
  record.value = result.records;
};

// 添加 | 修改请求的回调
let add = async () => {
  await formRef.value.validate();
  try {
    await reqAddTradeMark(addSearchParams);
    dialogFormVisible.value = false;
    ElMessage.success(addSearchParams.id ? '修改成功' : '添加成功');
    if(!addSearchParams.id) {
      current.value = 1;
    }
    getTradeMark();
  }catch(e) {
    ElMessage.error('失败');
  }
}

// 处理删除品牌数据的回调
let DeleteTradeMark = async (row: any) => {
  if(confirm(`你确定要删除${row.tmName}吗`)) {
    try {
      await reqDeleteTradeMark(row.id);
      getTradeMark();
      ElMessage.success('删除成功');
    }catch(e) {
      ElMessage.error('删除失败');
    }
  }
}

// 点击修改按钮的回调
let edit = (row: any) => {
  addSearchParams.tmName = row.tmName;
  addSearchParams.logoUrl = row.logoUrl;
  addSearchParams.id = row.id;
  dialogFormVisible.value = true;
}

// 添加品牌的回调
const addTrademark = () => {
  dialogFormVisible.value = true;
  addSearchParams.tmName = '';
  addSearchParams.logoUrl = '';
  addSearchParams.id = '';
  
  // 因为form使用 v-if 来隐藏的，点击时，dom还没渲染完，无法直接拿到 form 的实例
  nextTick(() => {
  formRef.value.clearValidate('tmName');
  formRef.value.clearValidate('logoUrl');
  })
}

// 导出excel回调
let SendExcel = () => {
  let worksheet = XLSX.utils.json_to_sheet(record.value);
  let workBook = XLSX.utils.book_new();
  XLSX.utils.sheet_add_aoa(worksheet, [["序号", "品牌名称", "品牌LOGO"]], {
    origin: "A1",
  });
  XLSX.utils.book_append_sheet(workBook, worksheet);
  XLSX.writeFile(workBook, "aaa.xlsx");
};

// 分页改变的回调
let sizeHandler = () => {
  current.value = 1;
  getTradeMark();
};

// 头像上传之前的回调（对图片大小以及类型进行约束）
const beforeAvatarUpload = (rawFile: any) => {
  if(rawFile.type == 'image/gif' || rawFile.type == 'image/jpg' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/png') {
    if(rawFile.size / 1024 / 1024 < 5) {
      return true;
    }else {
      ElMessage.error('文件类型只能是jpg|jpeg|gif|png,大小必须小于5MB');
    }
  }else {
    ElMessage.error('文件类型只能是jpg|jpeg|gif|png,大小必须小于5MB');
    return false;
  }
}

// 图片上传成功的回调，获取图片在服务器的地址
const handleAvatarSuccess = (response: any) => {
  addSearchParams.logoUrl = response.data;
  formRef.value.clearValidate('logoUrl');
}

// 校验品牌名称的回调
const validatorName = (rule: any, value: any, callBack: any) => {
  if(value.length > 2) {
    callBack();
  }else {
    callBack(new Error('品牌名称的长度必须大于2'))
  }
}

// 校验品牌Logo的回调
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  if(value) {
    callBack();
  }else {
    callBack(new Error('请上传图片'))
  }
}

// 自定义表单规则
let rules = {
  tmName: [
    {required: true, validator: validatorName, trigger: 'blur'}
  ],
  logoUrl: [
    {required: true, validator: validatorLogoUrl, trigger: 'blur'}
  ]
}

// OnMounted钩子函数，页面渲染完毕立即执行获取品牌数据的钩子
onMounted(() => {
  getTradeMark();
});
</script>


<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>