<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级标题">
        <el-select v-model="city">
          <el-option value="1" label="北京"></el-option>
          <el-option value="2" label="上海"></el-option>
          <el-option value="3" label="成都"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级标题">
        <el-select v-model="city">
          <el-option value="1" label="北京"></el-option>
          <el-option value="2" label="上海"></el-option>
          <el-option value="3" label="成都"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级标题">
        <el-select v-model="city">
          <el-option value="1" label="北京"></el-option>
          <el-option value="2" label="上海"></el-option>
          <el-option value="3" label="成都"></el-option>
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