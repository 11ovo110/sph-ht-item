<template>
  <div class="box" ref="box"></div>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';

let box = ref();
onMounted(() => {
  let myecharts = echarts.init(box.value);
  let options = {
    xAxis: {
      type: 'category',
      axisPointer: {
        show: true
      },
      boundaryGap: 0
    },
    yAxis: {
      show: false
    },
    series: {
      type: 'line',
      smooth: true,
      data: props.orderTrend,
      symbol: 'none',
      areaStyle: {
        color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: '#29a24b' // 0% 处的颜色
        }, {
          offset: 1, color: '#2eefc0' // 100% 处的颜色
        }],
        global: false // 缺省为 false
      }
      }
    },
    grid: {
      bottom: 0,
      top: 0,
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
          offset: 0, color: '#96c87e' // 0% 处的颜色
        }, {
          offset: 1, color: '#88cce5' // 100% 处的颜色
        }],
        global: false // 缺省为 false
      }
    },
    tooltip: {
      axisPointer: {
        type: 'shadow',
      },
      confine: true,
      backgroundColor:'rgba(0,0,0,.5)',
      position: function (point: any, params: any, dom: any, rect: any, size: any) {
        // 固定在顶部
        return [point[0], "10%"];
      },
      textStyle: {
        color: 'white'
      }
    }
  }
  myecharts.setOption(options);
  window.onresize = function() {
  myecharts.resize();
}
})


let props = defineProps(['orderTrend']); 
</script>

<style scoped>
.box {
  width: 100%;
  height: 100%;
}
</style>