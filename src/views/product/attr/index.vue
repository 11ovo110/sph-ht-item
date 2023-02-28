<template>
    <div>
    <Category :flag="flag"></Category>
    <el-card style="margin-top: 20px">
    <div v-show="!flag">
        <el-button type="primary" :icon="Plus" @click="add">添加平台属性</el-button>
    <el-table style="margin: 20px 0" border :data="categoryList" v-show="categoryList.length">
        <el-table-column width="80" align="center" label="序号" type="index"></el-table-column>
        <el-table-column width="100" label="属性名称" prop="attrName"></el-table-column>
        <el-table-column label="属性值名称">
            <template #="{row, $index}">
                <el-tag v-for="value in row.attrValueList" :key="value.id" style="margin: 0 5px">{{ value.valueName }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
            <template #="{row, $index}">
                    <el-button :icon="Edit" type="warning"></el-button>
                    <el-button :icon="Delete" type="danger"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-empty description="网络异常" v-show="!categoryList.length"></el-empty>
    </div>
    <div v-show="flag">
        <el-form>
            <el-form-item label="属性名称">
                <el-input placeholder="请您输入属性的名字" v-model="addSearchParams.attrName"></el-input>
            </el-form-item>
        </el-form>
        <el-button :icon="Plus" @click="addValue" :disabled="addSearchParams.attrName ? false : true">添加属性值</el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table border style="margin: 20px 0" :data="addSearchParams.attrValueList">
            <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
            <el-table-column label="属性值">
                <template #="{row, $index}">
                    <el-input v-show="row.flag" v-model="row.valueName" @blur="inputBlur(row, $index)" :ref="(el) => inputRef[$index] = el"></el-input>
                    <div v-show="!row.flag" @click="clickDiv(row, $index)">{{ row.valueName }}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200"></el-table-column>
        </el-table>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
    </div>
    </el-card>
    </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/category';
import { reqAddCategory, reqGetCategory } from '@/api/product/attr';
import { ref, watch, nextTick } from 'vue';
import { Delete, Edit, Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

let categoryStore = useCategoryStore();
let categoryList: any = ref([]);
let flag = ref(0);
let addSearchParams: any = ref({
    attrName: '',
    attrValueList: [],
    categoryId: '',
    categoryLevel: 3
})
let inputRef: any = ref([]);

watch(() => categoryStore.c3Id, () => {
    categoryList.value = [];
    if(categoryStore.c3Id) {
        getCategory();
    }
})

let getCategory = async () => {
    let {c1Id, c2Id, c3Id} = categoryStore;
    let result = await reqGetCategory(c1Id, c2Id, c3Id);
    categoryList.value = result;
}

let add = () => {
    flag.value = 1;
    addSearchParams.value = {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3
    }
}

let addValue = () => {
    addSearchParams.value.attrValueList.push({
        valueName: '',
        flag: true
    })
    nextTick(() => {
        inputRef.value[addSearchParams.value.attrValueList.length - 1].focus();
    })
}

let save = async () => {
await reqAddCategory(addSearchParams.value);
ElMessage.success('保存成功');
flag.value = 0;
getCategory();
}

let inputBlur = (row: any, index: any) => {
    if(!row.valueName.trim()) {
        addSearchParams.value.attrValueList.splice(index, 1);
        ElMessage.error('属性值不能为空');
        return;
    }
    let repeat = addSearchParams.value.attrValueList.find(item => {
        if(item != row) {
            return item.valueName == row.valueName;
        }
    })
    if(repeat) {
        addSearchParams.value.attrValueList.splice(index, 1);
        ElMessage.error('属性值不能重复');
        return;
    }else {
        row.flag = false;
    }
}

let clickDiv = (row: any, $index: any) => {
    row.flag = true;
    nextTick(() => {
        inputRef.value[$index].focus();
    })
}

let cancel = () => {
    flag.value = 0;
}

</script>

<style scoped>

</style>