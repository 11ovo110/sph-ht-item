<template>
  <div>
    <chartTop :data="dataList"></chartTop>
    <chartMiddle></chartMiddle>
    <chartBottom></chartBottom>
  </div>
</template>

<script setup lang='ts'>
import { reqData } from '@/api/home';
import { onMounted, ref } from 'vue';
import chartBottom from './chartBottom/index.vue';
import chartMiddle from './chartMiddle/index.vue';
import chartTop from './chartTop/index.vue';

let dataList = ref({});

onMounted(async () => {
  let result =  await reqData();
  dataList.value = result;
})
</script>

<style scoped>

</style>