<template>
  <Category :flag="flag"></Category>
  <el-card style="margin-top: 20px">
    <div v-show="!flag">
      <el-button
        type="primary"
        :disabled="CategoryStore.c3Id ? false : true"
        @click="add"
        >添加平台属性</el-button
      >
      <el-form style="margin-top: 20px">
        <el-table
          :data="attrArr"
          style="width: 100%"
          border
          v-if="attrArr.length"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          />
          <el-table-column prop="attrName" label="属性名称" width="100" />
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag
                v-for="value in row.attrValueList"
                :type="value.id % 2 ? 'success' : 'info'"
                :key="value.id"
                style="margin: 0 5px"
                >{{ value.valueName }}</el-tag
              >
            </template> </el-table-column
          >>
          <el-table-column label="操作" width="200">
            <template #="{ row, $index }">
            <el-button type="warning" :icon="Edit" @click="updateAttr(row)"></el-button>
            <el-popconfirm :title="`你确定删除${row.attrName}吗`" @confirm="deleteAttr(row)">
              <template #reference>
                <el-button type="danger" :icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
          </el-table-column>
        </el-table>
        <el-empty description="网络异常" v-else></el-empty>
      </el-form>
    </div>
    <div v-show="flag == 1">
      <el-form>
        <el-form-item label="属性名称">
          <el-input placeholder="请您输入属性的名字" v-model="addSearchParams.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" :icon="Plus" @click="addValue" :disabled="addSearchParams.attrName ? false : true">添加属性值</el-button>
      <el-button @click="cancel">取消</el-button>
      <el-table border style="margin: 20px 0" :data="addSearchParams.attrValueList">
        <el-table-column
          width="80"
          type="index"
          label="序号"
          align="center"
        ></el-table-column>
        <el-table-column label="属性值">
          <template #="{ row, $index }">
            <el-input v-model="row.valueName" :ref="(el) => inputRef[$index] = el" v-show="row.flag" @blur="InputOnBlur(row, $index)"></el-input>
            <div v-show="!row.flag" @click="clickDiv(row, $index)">{{ row.valueName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #="{row, $index}">
            <el-button :icon="Delete" type="danger" @click="addSearchParams.attrValueList.splice($index, 1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="save" :disabled="addSearchParams.attrValueList.length ? false: true">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>

<script setup lang='ts'>
// 导入全局组件（分类组件）
import Category from "@/components/Category/index.vue";
// 导入仓库
import { useCategoryStore } from "@/stores/category";
import { reactive, ref, watch, nextTick, onUnmounted } from "vue";
// 导入请求函数
import { reqAddattrOrUpdateAttr, reqAttrInfo, reqDeleteAttr } from "@/api/product/attr";
// 导入element-plus图标
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
// 弹出提示框
import { ElMessage } from "element-plus";
import cloneDeep from "lodash/cloneDeep";

// 获取小仓库
let CategoryStore = useCategoryStore();
// 定义获取数据的数组
let attrArr: any = ref([]);
// 定义控制跳转的参数
let flag = ref(0);
let inputRef: any = ref([]);

// 定义获取表单数据
let addSearchParams: any = ref({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3
});


// 监听三级标题的变化，发送请求获取数据
watch(
  () => CategoryStore.c3Id,
  () => {
    attrArr.value = [];
    if (!CategoryStore.c3Id) return;
    GetAttrInfo();
  }
);

// 定义获取平台属性的函数
const GetAttrInfo = async () => {
  let { c1Id, c2Id, c3Id } = CategoryStore;
  let result = await reqAttrInfo(c1Id, c2Id, c3Id);
  attrArr.value = result;
}

// 点击取消的回调
const cancel = () => {
  flag.value = 0;
};

// 点击添加属性值的回调
let addValue = () => {
  addSearchParams.value.attrValueList.push({
    valueName: '',
    flag: true
  })
  nextTick(() => {
    inputRef.value[addSearchParams.value.attrValueList.length - 1].focus();
  })
}

// 点击会触发跳转的回调
const add = () => {
  flag.value = 1;
  addSearchParams.value = {
  attrName: '',
  attrValueList: [],
  categoryId: CategoryStore.c3Id,
  categoryLevel: 3
}
};

// 点击保存的回调
const save = async () => {
  if(addSearchParams.value.attrValueList.length) {
    try {
      await reqAddattrOrUpdateAttr(addSearchParams.value);
    ElMessage.success('添加成功');
    flag.value = 0;
    GetAttrInfo();
    }catch(e) {
      ElMessage.error('添加失败');
    }
  }
}

// input框失去焦点
const InputOnBlur = (row: any, index: any) => {
  // 判断输入框是否为空
  if(!row.valueName.trim()) {
    // 删除为空的属性
    addSearchParams.value.attrValueList.splice(index, 1);
    ElMessage.error('属性名不能为空')
  }else {
    // 判断是否有重复值
   let repeat =  addSearchParams.value.attrValueList.find((item: { valueName: any; }) => {
      if(row != item) {
        return item.valueName == row.valueName;
      }
    })
    if(repeat) {
      // 删除重复值
      addSearchParams.value.attrValueList.splice(index, 1);
      ElMessage.error('属性名重复')
    }else {
      row.flag = false;
    }
  }
}

// 点击div的回调，显示input输入框
const clickDiv = (row: any, index: any) => {
  row.flag = true;
  nextTick(() => {
    inputRef.value[index].focus();
  })
}

const updateAttr = (row: any) => {
flag.value = 1;
addSearchParams.value = cloneDeep(row);
}

const deleteAttr = async (row: any) => {
await reqDeleteAttr(row.id);
ElMessage.success('删除成功');
GetAttrInfo();
}

onUnmounted(() => {
  CategoryStore.c1Id = '';
  CategoryStore.c1Arr = [];
  CategoryStore.c2Id = '';
  CategoryStore.c2Arr = [];
  CategoryStore.c3Id = '';
  CategoryStore.c3Arr = [];
})


</script>

<style scoped>
</style>