<template>
  <div class="box">
    <v-chart :option="getOption()" autoresize></v-chart>
  </div>
</template>

<script setup lang='ts'>

function getOption() {
  return {
    grid: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    xAxis: {
      show: false,
      min: 0,
      max: 100
    },
    yAxis: {
      show: false,
      type: 'category'
    },
    series: {
      type: 'bar',
      data: [80],
      barWidth: 10,
      itemStyle: {
        color: 'yellowgreen'
      },
      label: {
        show: true,
        position: 'right',
        formatter: '|',
        color: 'yellowgreen'
      },
      showBackground: true
    }
  }
}

</script>

<style scoped>
.box {
  width: 100%;
  height: 100%;
}
</style>