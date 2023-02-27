<template>
  <!-- card:属性shadow:always一直有阴影  never:没有阴影  hover:鼠标进入的时候阴影 -->
  <!-- 具名插槽：header,设置卡片头部 -->
  <!-- body-style:设置卡片身体部分样式 -->
  <el-card shadow="hover">
    <el-button type="primary" :icon="Plus" @click="AddTrademark">添加品牌</el-button>
    <el-button type="primary" @click="ExportExcel">将此页数据导出excel</el-button>
    <!-- 表格组件 -->
    <el-table border style="margin: 10px 0px" :data="records">
      <el-table-column
        label="序号"
        width="80"
        align="center"
        type="index"
      ></el-table-column>
      <!--组件:prop->展示数据字段。默认用div展示-->
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{ row, $index }">
          <el-button type="warning" :icon="Edit" @click="updateTrademark(row)"></el-button>
          <el-popconfirm :title="`你确定删除${row.tmName}吗`" @confirm="deleteTrademark(row.id)">
          <template #reference>
            <el-button type="danger" :icon="Delete"></el-button>
          </template>
         </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件 -->
    <!-- 
        layout:可以调整六个子组件的位置
        small:属性的属性值需要布尔值,真,小的分页器，假,大的分页器
        disabled:禁用的设置,true:禁用,false,不禁用
        background:设置按钮的背景颜色.true:有天蓝色背景,false,没有背景颜色
        total:设置总条数
     -->
    <el-pagination
      layout="prev, pager, next, jumper,->,sizes,total"
      :small="false"
      :disabled="false"
      :background="true"
      :total="total"
      :page-sizes="[3, 5, 7, 9, 11]"
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :prev-icon="DArrowLeft"
      :next-icon="DArrowRight"
      @current-change="getTradeMarkList"
      @size-change="sizeChange"
    />
    <el-dialog v-model="dialogFormVisible" class="el-dialog" :title="addSearchParams.id ? '修改品牌' : '添加品牌'" >
    <el-form :rules="rules" :model="addSearchParams" ref="formRef">
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input placeholder="请输入品牌名称" v-model="addSearchParams.tmName" />
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <el-upload
        class="avatar-uploader"
        action="/app-dev/admin/product/fileUpload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
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
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx';
import {
  Plus,
  DArrowLeft,
  DArrowRight,
  Edit,
  Delete,
} from "@element-plus/icons-vue";
//引入ref响应式数据函数
import { ref, onMounted, reactive, nextTick } from "vue";
//引入请求方法
import { reqAddTrademark, reqTrademarkList, reqDeleteTrademark } from "../../../api/product/trademark/index";
import { ElMessage } from 'element-plus';
//收集当前页码
let pageNo = ref<number>(1);
//收集一页展示几条数据
let pageSize = ref<number>(3);
//收集服务器返回品牌总个数|已有品牌的数据
let total = ref<number>(0);
let records = ref<any>([]);
// 获取表单实例
let formRef = ref();
//组件挂载完毕:先获取一次已有品牌数据
let addSearchParams = reactive({
  tmName: '',
  logoUrl: ''
})

let dialogFormVisible = ref(false);

onMounted(() => {
  //组件挂载完毕先获取一次商品数据
  getTradeMarkList();
});

//获取已有品牌的数据
const getTradeMarkList = async (pager=1) => {
  //修改当前页码
  pageNo.value = pager;
  let result: any = await reqTrademarkList(pageNo.value, pageSize.value);
  //替换数据
  records.value = result.records;
  total.value = result.total;
};

//分页器自定义事件回调[下拉菜单]
const sizeChange = () => {
  //立马再次发请求
  getTradeMarkList();

};

// 导出excel的回调函数
let ExportExcel = () => {
  let worksheet = XLSX.utils.json_to_sheet(records.value); 	// 将JSON数据，生成单元格数据
  let workBook = XLSX.utils.book_new();		// 创建excel容器
// 设置单元格标题
  XLSX.utils.sheet_add_aoa(worksheet, [["序号", "品牌名称", "品牌LOGO"]], {
    origin: "A1",
  });
// 将数据追加到excel容器中准备导出
  XLSX.utils.book_append_sheet(workBook, worksheet);
// 导出excel
  XLSX.writeFile(workBook, "aaa.xlsx");
}

// 添加品牌的回调
const AddTrademark = () => {
  dialogFormVisible.value = true;
  addSearchParams.tmName = '';
  addSearchParams.logoUrl = '';
  addSearchParams.id = '';
  nextTick(() => {
  formRef.value.clearValidate('tmName');
  formRef.value.clearValidate('logoUrl');
  })
}

// 用户头像上传成功的回调
let handleAvatarSuccess = (response: any) => {
  addSearchParams.logoUrl = response.data;
}

// 用户头像上传之前的回调
const beforeAvatarUpload = (rawFile: any) => {
  if(rawFile.type == 'image/gif' || rawFile.type == 'image/png' || rawFile.type == 'image/jpg' || rawFile.type == 'image/jpeg') {
    if(rawFile.size / 1024 / 1024 < 5) {
      ElMessage.success('成功');
      return true;
    }else {
      ElMessage.error('失败');
      return false;
    }
  }else {
    ElMessage.error('失败');
      return false;
  }
}

// 品牌名称校验回调
const validatorName = (rule: any, value: any, callBack: any) => {
  console.log(rule);
  
  console.log(value);
  
  if(value.length >= 2) {
    callBack();
  }else {
    callBack(new Error('名字长度必须大于2'))
  }
}

const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  if(value) {
    callBack();
  }else {
    callBack(new Error('请上传头像'))
  }
}

// 设置表单校验规则
let rules = {
  tmName: [
    {required: true, validator: validatorName}
  ],
  logoUrl: [
    {required: true, validator: validatorLogoUrl}
  ]
}

// 点击确定的回调，添加品牌
const add = async () => {
  await formRef.value.validate();
  try {
   await reqAddTrademark(addSearchParams);
   ElMessage.success('添加成功');
   dialogFormVisible.value = false;
   addSearchParams.id = '';
   getTradeMarkList();
  }catch(e) {
    ElMessage.error('添加失败');
    addSearchParams.id = '';
  }
}

// 点击修改的回调
const updateTrademark = (row) => {
dialogFormVisible.value = true;
addSearchParams.tmName = row.tmName;
addSearchParams.logoUrl = row.logoUrl;
addSearchParams.id = row.id;
nextTick(() => {
  formRef.value.clearValidate('tmName');
  formRef.value.clearValidate('logoUrl');
  })
}

// 点击删除的回调

const deleteTrademark = async (id) => {
  await reqDeleteTrademark(id);
  ElMessage.success('删除成功');
  getTradeMarkList();
}

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.item {
  margin-right: 40px;
  margin-left: 20px;
}

.el-dropdown {
  margin-top: 1.1rem;
}

.el-dialog {
  margin-top: 100px!important;
}

</style>

<style>

.el-dialog {
  margin-top: 80px;
}

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