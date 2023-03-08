<template>
  <el-row :gutter="10">
    <el-col :span="6">
      <card>
        <template #title>
            <div>{{ data['//1'] }}</div>
        </template>
        <template #number>
          <div>
            {{ data.salesToday }}            
          </div>
        </template>
        <template #chart>
            <p class="text">日同比: {{ data.salesGrowthLastDay }}<svg t="1678172442236" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4505" width="16" height="16"><path d="M256 366.592l0-187.392 164.864 139.264 179.2-209.92 1.024-3.072 1.024 1.024 1.024-1.024 9.216 11.264 308.224 308.224 101.376-100.352 0 316.416-317.44-3.072 111.616-109.568-201.728-202.752-165.888 194.56-7.168 9.216 0-1.024zM928.768 704.512q19.456 0 37.376 7.68t30.72 20.48 20.48 30.72 7.68 37.376q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68l-832.512 0q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888l0-641.024q0-19.456 7.68-36.864t20.48-30.208 30.208-20.48 37.888-7.68q19.456 0 36.864 7.168t30.208 19.968 20.992 29.696 8.192 36.352l0 546.816 736.256 0z" p-id="4506" fill="#d81e06"></path></svg></p>
            <p class="text">月同比: {{ data.salesGrowthLastMonth }}<svg t="1678172146166" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2920" width="16" height="16"><path d="M75.851852 948.148148V0H0v1024h1024v-75.851852H75.851852z" fill="#1afa29" p-id="2921"></path><path d="M408.841481 685.700741l227.555556 151.703703 225.28-451.318518 79.644444 46.26963V84.954074L640.18963 258.654815l89.505185 51.579259-152.462222 305.682963-227.555556-151.703704-190.388148 380.017778 136.533333 67.508148 113.019259-226.038518z" fill="#1afa29" p-id="2922"></path></svg></p>
        </template>
        <template #bottom>
            <div>昨日销售额:{{ data.salesLastDay }}</div>
        </template>
      </card>
    </el-col>
    <el-col :span="6">
      <card>
        <template #title>
            <div>{{ data['//2'] }}</div>
        </template>
        <template #number>
          <div>
            {{ data.orderToday }}            
          </div>
        </template>
        <template #chart>
            <Line :orderTrend="data.orderTrend" v-if="data.orderTrend"></Line>
          </template>
        <template #bottom>
            <div>昨日订单:{{ data.orderLastDay }}</div>
        </template>
      </card>
    </el-col>
    <el-col :span="6">
      <card>
        <template #title>
            <div>{{ data['//3'] }}</div>
        </template>
        <template #number>
          <div>
            {{ data.orderUser }}            
          </div>
        </template>
        <template #chart>
            <bar :orderUserTrend="data.orderUserTrend" v-if="data.orderUserTrend"></bar>
          </template>
        <template #bottom>
            <div>退货率:{{ data.returnRate }}</div>
        </template>
      </card>
    </el-col>
    <el-col :span="6">
      <card>
        <template #title>
            <div>{{ data['//4'] }}</div>
        </template>
        <template #number>
          <div>
            {{ data.usersTotal }}            
          </div>
        </template>
        <template #chart>
            <Progress></Progress>
          </template>
        <template #bottom>
           <div>
            <span>日同比:{{ data.userGrowthLastDay }}</span>
            <span style="margin-left: 8px">月同比:{{ data.userGrowthLastMonth }}</span>
           </div>
        </template>
      </card>
    </el-col>
  </el-row>
</template>

<script setup lang='ts'>
import card from './card/index.vue';
import Line from './Line/index.vue'
import bar from './bar/index.vue';
import Progress from './progress/index.vue'
defineProps(['data']);
</script>

<style scoped lang="less">
.text {
  font-size: 14px;
  color: yellowgreen;
  margin: 0;
  padding: 2;
  svg {
  margin-left: 5px;
}
}

</style>