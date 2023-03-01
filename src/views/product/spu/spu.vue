<template>
  <div>
    <Category :flag="flag"></Category>
    <el-card shadow="always" style="margin-top: 10px">
      <div v-show="!flag">
        <el-button
          type="primary"
          @click="addSpu"
          :icon="Plus"
          :disabled="records.length ? false : true"
          >添加SPU</el-button
        >
        <el-table style="margin: 10px 0" border :data="records">
          <el-table-column
            label="序号"
            width="80"
            align="center"
            type="index"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                :icon="Plus"
                @click="addSpu"
              ></el-button>
              <el-button type="warning" size="small" :icon="Edit" @click="updateSPU(row)"></el-button>
              <el-button
                type="info"
                size="small"
                :icon="InfoFilled"
              ></el-button>
              <el-button type="danger" size="small" :icon="Delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="current"
          v-model:page-size="limit"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @size-change="sizeHandler"
          @current-change="getSpuDate"
        />
      </div>
      <spu-form v-show="flag == 1" @getFlag="flag = $event" ref="spu"></spu-form>
      <sku-form v-show="flag == 2"></sku-form>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
// 引入图标
import { Delete, Edit, InfoFilled, Plus } from "@element-plus/icons-vue";
import { onUnmounted, ref, watch } from "vue";
// 引入小仓库
import { useCategoryStore } from "@/stores/category";
// 引入请求函数
import { reqgetSPUDate } from "@/api/product/spu/index";
// 引入sku页面
import skuForm from "./skuForm.vue";
// 引入spu页面
import spuForm from "./spuForm.vue";

// 使用小仓库
let categoryStore = useCategoryStore();
// 设置当前页
let current = ref(1);
// 设置一页多少个数据
let limit = ref(3);
// 定义存储数据的变量
let records = ref([]);
// 定义总条数
let total = ref(0);
// 定义场景切换的变量
let flag = ref(0);
// 获取spuForm的实例
let spu = ref();

// 监听，如果三级Id发生变化就会触发
watch(
  () => categoryStore.c3Id,
  () => {
    // 把上次数据清空，如果三级请求删除也会触发，此时页面不应该有数据展示
    records.value = [];
    // 判断是否有三级Id，没有就不会发请求
    if (categoryStore.c3Id) {
      getSpuDate();
    }
  }
);

// 定义获取数据的函数，因为会多次使用，所以独立封装成函数
const getSpuDate = async () => {
  // 获取数据
  let result: any = await reqgetSPUDate(
    current.value,
    limit.value,
    categoryStore.c3Id
  );
  records.value = result.records;
  // 把回传数据的总条数赋值给total
  total.value = result.total;
};

// 定义分页器limit变化触发的回调
const sizeHandler = () => {
  current.value = 1;
  getSpuDate();
};

// 组件销毁，清理仓库的数据
onUnmounted(() => {
  categoryStore.c1Id = "";
  categoryStore.c1Attr = [];
  categoryStore.c2Id = "";
  categoryStore.c2Attr = [];
  categoryStore.c3Id = "";
  categoryStore.c3Attr = [];
});

// 点击添加SPU的回调
const addSpu = () => {
  flag.value = 1;
};

// 点击编辑的回调
const updateSPU = (row: any) => {
  flag.value = 1;
  spu.value.getSpuList(row);
}

</script>

<style scoped>
</style>