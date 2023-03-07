<template>
  <el-card class="container">
    <div class="chart_title"><slot name="title"></slot></div>
    <div class="chart_number"><slot name="number"></slot></div>
    <div class="chart"><slot name="chart"></slot></div>
    <div class="chart_bottom"><slot name="bottom"></slot></div>
  </el-card>
</template>

<script setup lang='ts'>

</script>

<style scoped lang="less">
@color: yellowgreen;
@size: 13px;
.container {
  .chart_title {
    color: @color;
    font-size: 14px;
  }
  .chart_number {
    text-indent: 8px;
    font-size: 20px;
    color: @color;
    font-weight: 900;
    font-style: italic;
  }
  .chart {
    width: 100%;
    height: 80px;
    margin: 5px 0;
    border-bottom: 1px solid @color;
  }
  .chart_bottom {
    font-size: @size;
    color: @color;
  }
}
</style>