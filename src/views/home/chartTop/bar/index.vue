<template>
  <div class="box">
    <v-chart autoresize :option="getOption()"></v-chart>
  </div>
 
</template>

<script setup lang='ts'>
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';

function getOption() {
  return  ({
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      show: true,
      backgroundColor: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#8cc2ce' // 0% 处的颜色
          }, {
            offset: 1, color: '#9acd36' // 100% 处的颜色
          }],
          global: false // 缺省为 false
      }
    },
    xAxis: {
      show: false,
      type: 'category',
    },
    yAxis: {
      show: false,
    },
    series: {
      type: 'bar',
      data: props.orderUserTrend,
      itemStyle: {
        color: (item: any) => {
          let arr = ["red",
            "orange",
            "yellow",
            "blue",
            "cyan",
            "purple",
            "red",
            "orange",
            "yellow",
            "blue",
            "cyan",
            "purple",
            "hotpink",
            "yellow"]
            return arr[item.dataIndex]
        }
      }
    },
    tooltip: {
      axisPointer: {
        type: 'cross'
      },
      confine: true,
      position: function (point: any, params: any, dom: any, rect: any, size: any) {
      // 固定在顶部
      return [point[0], '10%'];
  }
    }
  })
}

let props = defineProps(['orderUserTrend'])
</script>

<style scoped>
.box {
  width: 100%;
  height: 100%;
}
</style>