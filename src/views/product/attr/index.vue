<template>
    <div>
    <Category :flag="flag"></Category>
    <el-card style="margin-top: 20px">
    <div v-show="!flag">
        <el-button type="primary" @click="add" :disabled="attrStore.c3Id ? false : true">添加平台属性</el-button>
    <el-table border style="margin: 20px" :data="CategoryList" v-show="CategoryList.length">
        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column label="属性名称" width="100" prop="attrName"></el-table-column>
        <el-table-column label="属性值名称">
            <template #="{row, $index}">
                    <el-tag v-for="value in row.attrValueList" :key="value.id">{{ value.valueName }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
            <el-button :icon="Edit" type="warning"></el-button>
            <el-button :icon="Delete" type="danger"></el-button>
        </el-table-column>
    </el-table>
    <el-empty description="网络出错了" v-show="!CategoryList.length"></el-empty>
    </div>
    <div v-show="flag == 1">
        <el-form>
            <el-form-item label="属性名称">
                <el-input placeholder="请您输入属性的名字" v-model="addSearchParams.attrName"></el-input>
            </el-form-item>
        </el-form>
        <el-button :icon="Plus" type="primary" @click="addValue" :disabled="addSearchParams.attrName ? false: true">添加属性值</el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table border style="margin: 20px 0" :data="addSearchParams.attrValueList">
            <el-table-column label="序号" align="center" type="index" width="80"></el-table-column>
            <el-table-column label="属性值">
                <template #="{row, $index}">
                    <el-input  v-show="row.flag" v-model="row.valueName" @blur="inputBlur(row, $index)" :ref="(el) => inputRef[$index] = el"></el-input>
                    <div v-show="!row.flag" @click="clickDiv(row, $index)">{{ row.valueName }}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template #="{row, $index}">
                <el-button :icon="Delete" type="danger" @click="addSearchParams.attrValueList.splice($index, 1)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
    </div>
    </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useAttrStore } from "@/stores/attr";
import { reqAddCategoryOrUpdate, reqGetCategory, reqDeleteCategory } from "@/api/product/attr";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

let inputRef: any = ref([]);

let attrStore = useAttrStore();

let CategoryList: any = ref([]);

let addSearchParams: any = ref({
    attrName: '',
    attrValueList: [],
    categoryId: '',
    categoryLevel: 3
})

let flag = ref(0);

watch(() => attrStore.c3Id, async () => {
    CategoryList.value = [];
    if(attrStore.c3Id) {
        GetAttrValue();
    }
})

const GetAttrValue = async () => {
    let {c1Id, c2Id, c3Id} = attrStore;
    let result = await reqGetCategory(c1Id, c2Id, c3Id);
    CategoryList.value = result;
}

let add = () => {
    flag.value = 1;
    inputRef.value = [];
    addSearchParams.value = {
    attrName: '',
    attrValueList: [],
    categoryId: attrStore.c3Id,
    categoryLevel: 3
    }
}

let cancel = () => {
    flag.value = 0;
}

let addValue = () => {
    addSearchParams.value.attrValueList.push({
        valueName: '',
        flag: true
    })
    nextTick(() => {
        inputRef.value[inputRef.value.length - 1].focus();
    })
}

let save = async () => {
    await reqAddCategoryOrUpdate(addSearchParams.value);
    ElMessage.success('添加成功');
    flag.value = 0;
    GetAttrValue();
}

let inputBlur = (row: any, $index: any) => {
    if(!row.valueName.trim()) {
        addSearchParams.value.attrValueList.splice($index, 1);
        ElMessage.error('不允许属性为空');
    }else {
        let repeat = addSearchParams.value.attrValueList.find(item => {
            if(!item == row) {
            item.valueName == row.valueName;
            }
        })
        if(repeat) {
            addSearchParams.value.splice(addSearchParams.value.attrValueList.length - 1, 1);
            ElMessage.error('不允许有重复属性');
        }else {
            console.log(111);
            
            row.flag = false;
        }
    }
}

let clickDiv = (row: any, $index: any) => {
    row.flag = true;
    nextTick(() => {
        inputRef.value[$index].focus();
    })
}


</script>

<style scoped>

</style>