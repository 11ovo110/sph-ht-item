<template>
  <el-card class="middle">
    <el-tabs class="demo-tabs" v-model="active">
      <el-tab-pane label="销售额" name="sale"></el-tab-pane>
      <el-tab-pane label="访问量" name="visite"></el-tab-pane>
    </el-tabs>
    <div class="right">
      <span @click="setDay">今日</span>
      <span @click="setWeek">本周</span>
      <span @click="setMonth">本月</span>
      <span @click="setYear">本年</span>
      <el-date-picker v-model="dataTime" type="daterange" unlink-panels range-separator="-" start-placeholder="入住时间"
        end-placeholder="离开时间" size="small" value-format="YYYY-MM-DD" />
    </div>
    <el-row :gutter="10">
      <el-col :span="18">
        <div class="bar">
          <v-chart :option="getOption()"></v-chart>
        </div>
      </el-col>
      <el-col :span="6">
        <h1>门店{{ active == 'sale' ? '销售额' : '访问量' }}排名</h1>
        <ul>
          <li v-show="active == 'sale'" v-for="(item, index) in data.orderRank" :key="index" class="trank">
            <span :class="{'active': index < 3}">{{ index + 1 }}</span>
            <span>{{item.name}}</span>
            <span>{{item.count}}</span>
          </li>
          <li v-show="active == 'visite'" v-for="(item, index) in data.userRank" :key="index" class="trank">
            <span :class="{'active': index < 3}">{{ index + 1 }}</span>
            <span>{{item.name}}</span>
            <span>{{item.count}}</span>
          </li>
        </ul>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang='ts'>
import { ref } from "vue";
import dayjs from "dayjs";

let dataTime: any = ref([]);

const setDay = () => {
  let start = dayjs().format('YYYY-MM-DD');
  let end = dayjs().format('YYYY-MM-DD');
  dataTime.value = [start, end];
}

const setMonth = () => {
  let start = dayjs().startOf('month').format('YYYY-MM-DD');
  let end = dayjs().endOf('month').format('YYYY-MM-DD');
  dataTime.value = [start, end];
}

const setWeek = () => {
  let start = dayjs().day(1).format('YYYY-MM-DD');
  let end = dayjs().day(7).format('YYYY-MM-DD');
  dataTime.value = [start, end];
}

const setYear = () => {
  let start = dayjs().startOf('year').format('YYYY-MM-DD');
  let end = dayjs().endOf('year').format('YYYY-MM-DD');
  dataTime.value = [start, end];
}

let active = ref('sale');

const getOption = () => {
  return {
    title: {
      text: '销售额',
      left: '50%',
      textStyle: {
        color: 'yellowgreen'
      }
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      axisLine: {
        show: true
      },
      axisTick: {
        show: true
      },
      splitLine: {
        show: false
      }
    },
    grid: {
      left: 30,
      right: 0,
      bottom: 30
    },
    series: {
      type: 'bar',
      data: active.value == 'sale' ? prop.data.orderFullYear : prop.data.userFullYear,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'red' // 0% 处的颜色
          }, {
            offset: 1, color: 'blue' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
      label: {
        show: true,
        position: 'inside',
        color: 'hotpink'
      }
    }
  }
}

let prop: any = defineProps(['data'])

</script>

<style scoped lang="less">
.middle {
  position: relative;
  margin: 10px 0;

  .right {
    position: absolute;
    right: 20px;
    top: 26px;

    span {
      font-size: 14px;
      color: yellowgreen;
      padding: 0 10px;
    }

    ;
  }
}

:deep(.el-tabs__item) {
  font-size: 14px;
  color: yellowgreen;
}

:deep(.el-tabs__active-bar) {
  background-color: yellowgreen;
}

.bar {
  height: 300px;
}

.trank {
display: flex;
justify-content: space-between;
.active {
  color: white;
  width: 15px;
  height: 15px;
  background-color: black;
  border-radius: 50%;
  line-height: 15px;
  text-align: center;
}
}

</style>