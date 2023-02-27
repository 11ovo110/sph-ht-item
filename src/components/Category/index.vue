<template>
<el-card>
  <el-form inline>
    <el-form-item label="一级标题">
      <el-select v-model="city">
        <el-option label="北京" value="1">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级标题">
      <el-select v-model="city">
        <el-option label="北京" value="1">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级标题">
      <el-select v-model="city">
        <el-option label="北京" value="1">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</el-card>
</template>

<script setup lang='ts'>
import { ref } from "vue";

let city = ref('1');
</script>

<style scoped>

</style>