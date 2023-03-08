<template>
  <el-row :gutter="10">
    <el-col :span="14">
      <el-card>
        <template #header>
          <div class="header">
            <span>关键字搜索</span>
            <el-dropdown>
              <span class="el-dropdown-link">
                城市选择器
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>北京</el-dropdown-item>
                  <el-dropdown-item>上海</el-dropdown-item>
                  <el-dropdown-item>广州</el-dropdown-item>
                  <el-dropdown-item>深圳</el-dropdown-item>
                  <el-dropdown-item>长沙</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
        <el-row>
          <el-col :span="12">
            <div class="radar">
              <v-chart :option="getRadar()"></v-chart>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="radar">
              <v-chart :option="getK()"></v-chart>
            </div>
          </el-col>
        </el-row>
        <el-table border :data="records">
          <el-table-column width="80" type="index" align="center" label="序号" style="margin: 5px 0"></el-table-column>
          <el-table-column label="创建时间" prop="createTime"></el-table-column>
          <el-table-column label="用户名字" prop="nickName"></el-table-column>
          <el-table-column label="手机号码" prop="phoneNum"></el-table-column>
        </el-table>
        <el-pagination v-model:current-page="current" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]"
          :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
          @size-change="sizeHandler" @current-change="getUser" />
      </el-card>
    </el-col>
    <el-col :span="10">
      <el-card>
        <template #header>
          <div class="pie">
            <div>分类销售</div>
            <el-radio-group v-model="radio" size="small">
              <el-radio-button label="品类" />
              <el-radio-button label="商品" />
            </el-radio-group>
          </div>
        </template>
        <div class="setPie">
          <v-chart :option="getPie()" autoresize @mouseover="handler" ref="chart"></v-chart>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang='ts'>
import { reqUser } from '@/api/home';
import { ArrowDown } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue';

const upColor = '#ec0000';
const upBorderColor = '#8A0000';
const downColor = '#00da3c';
const downBorderColor = '#008F28';
let chart = ref();
let radio = ref('品类');
// Each item: open，close，lowest，highest
const data0 = splitData([
  ['2013/1/24', 2320.26, 2320.26, 2287.3, 2362.94],
  ['2013/1/25', 2300, 2291.3, 2288.26, 2308.38],
  ['2013/1/28', 2295.35, 2346.5, 2295.35, 2346.92],
  ['2013/1/29', 2347.22, 2358.98, 2337.35, 2363.8],
  ['2013/1/30', 2360.75, 2382.48, 2347.89, 2383.76],
  ['2013/1/31', 2383.43, 2385.42, 2371.23, 2391.82],
  ['2013/2/1', 2377.41, 2419.02, 2369.57, 2421.15],
  ['2013/2/4', 2425.92, 2428.15, 2417.58, 2440.38],
  ['2013/2/5', 2411, 2433.13, 2403.3, 2437.42],
  ['2013/2/6', 2432.68, 2434.48, 2427.7, 2441.73],
  ['2013/2/7', 2430.69, 2418.53, 2394.22, 2433.89],
  ['2013/2/8', 2416.62, 2432.4, 2414.4, 2443.03],
  ['2013/2/18', 2441.91, 2421.56, 2415.43, 2444.8],
  ['2013/2/19', 2420.26, 2382.91, 2373.53, 2427.07],
  ['2013/2/20', 2383.49, 2397.18, 2370.61, 2397.94],
  ['2013/2/21', 2378.82, 2325.95, 2309.17, 2378.82],
  ['2013/2/22', 2322.94, 2314.16, 2308.76, 2330.88],
  ['2013/2/25', 2320.62, 2325.82, 2315.01, 2338.78],
  ['2013/2/26', 2313.74, 2293.34, 2289.89, 2340.71],
  ['2013/2/27', 2297.77, 2313.22, 2292.03, 2324.63],
  ['2013/2/28', 2322.32, 2365.59, 2308.92, 2366.16],
  ['2013/3/1', 2364.54, 2359.51, 2330.86, 2369.65],
  ['2013/3/4', 2332.08, 2273.4, 2259.25, 2333.54],
  ['2013/3/5', 2274.81, 2326.31, 2270.1, 2328.14],
  ['2013/3/6', 2333.61, 2347.18, 2321.6, 2351.44],
  ['2013/3/7', 2340.44, 2324.29, 2304.27, 2352.02],
  ['2013/3/8', 2326.42, 2318.61, 2314.59, 2333.67],
  ['2013/3/11', 2314.68, 2310.59, 2296.58, 2320.96],
  ['2013/3/12', 2309.16, 2286.6, 2264.83, 2333.29],
  ['2013/3/13', 2282.17, 2263.97, 2253.25, 2286.33],
  ['2013/3/14', 2255.77, 2270.28, 2253.31, 2276.22],
  ['2013/3/15', 2269.31, 2278.4, 2250, 2312.08],
  ['2013/3/18', 2267.29, 2240.02, 2239.21, 2276.05],
  ['2013/3/19', 2244.26, 2257.43, 2232.02, 2261.31],
  ['2013/3/20', 2257.74, 2317.37, 2257.42, 2317.86],
  ['2013/3/21', 2318.21, 2324.24, 2311.6, 2330.81],
  ['2013/3/22', 2321.4, 2328.28, 2314.97, 2332],
  ['2013/3/25', 2334.74, 2326.72, 2319.91, 2344.89],
  ['2013/3/26', 2318.58, 2297.67, 2281.12, 2319.99],
  ['2013/3/27', 2299.38, 2301.26, 2289, 2323.48],
  ['2013/3/28', 2273.55, 2236.3, 2232.91, 2273.55],
  ['2013/3/29', 2238.49, 2236.62, 2228.81, 2246.87],
  ['2013/4/1', 2229.46, 2234.4, 2227.31, 2243.95],
  ['2013/4/2', 2234.9, 2227.74, 2220.44, 2253.42],
  ['2013/4/3', 2232.69, 2225.29, 2217.25, 2241.34],
  ['2013/4/8', 2196.24, 2211.59, 2180.67, 2212.59],
  ['2013/4/9', 2215.47, 2225.77, 2215.47, 2234.73],
  ['2013/4/10', 2224.93, 2226.13, 2212.56, 2233.04],
  ['2013/4/11', 2236.98, 2219.55, 2217.26, 2242.48],
  ['2013/4/12', 2218.09, 2206.78, 2204.44, 2226.26],
  ['2013/4/15', 2199.91, 2181.94, 2177.39, 2204.99],
  ['2013/4/16', 2169.63, 2194.85, 2165.78, 2196.43],
  ['2013/4/17', 2195.03, 2193.8, 2178.47, 2197.51],
  ['2013/4/18', 2181.82, 2197.6, 2175.44, 2206.03],
  ['2013/4/19', 2201.12, 2244.64, 2200.58, 2250.11],
  ['2013/4/22', 2236.4, 2242.17, 2232.26, 2245.12],
  ['2013/4/23', 2242.62, 2184.54, 2182.81, 2242.62],
  ['2013/4/24', 2187.35, 2218.32, 2184.11, 2226.12],
  ['2013/4/25', 2213.19, 2199.31, 2191.85, 2224.63],
  ['2013/4/26', 2203.89, 2177.91, 2173.86, 2210.58],
  ['2013/5/2', 2170.78, 2174.12, 2161.14, 2179.65],
  ['2013/5/3', 2179.05, 2205.5, 2179.05, 2222.81],
  ['2013/5/6', 2212.5, 2231.17, 2212.5, 2236.07],
  ['2013/5/7', 2227.86, 2235.57, 2219.44, 2240.26],
  ['2013/5/8', 2242.39, 2246.3, 2235.42, 2255.21],
  ['2013/5/9', 2246.96, 2232.97, 2221.38, 2247.86],
  ['2013/5/10', 2228.82, 2246.83, 2225.81, 2247.67],
  ['2013/5/13', 2247.68, 2241.92, 2231.36, 2250.85],
  ['2013/5/14', 2238.9, 2217.01, 2205.87, 2239.93],
  ['2013/5/15', 2217.09, 2224.8, 2213.58, 2225.19],
  ['2013/5/16', 2221.34, 2251.81, 2210.77, 2252.87],
  ['2013/5/17', 2249.81, 2282.87, 2248.41, 2288.09],
  ['2013/5/20', 2286.33, 2299.99, 2281.9, 2309.39],
  ['2013/5/21', 2297.11, 2305.11, 2290.12, 2305.3],
  ['2013/5/22', 2303.75, 2302.4, 2292.43, 2314.18],
  ['2013/5/23', 2293.81, 2275.67, 2274.1, 2304.95],
  ['2013/5/24', 2281.45, 2288.53, 2270.25, 2292.59],
  ['2013/5/27', 2286.66, 2293.08, 2283.94, 2301.7],
  ['2013/5/28', 2293.4, 2321.32, 2281.47, 2322.1],
  ['2013/5/29', 2323.54, 2324.02, 2321.17, 2334.33],
  ['2013/5/30', 2316.25, 2317.75, 2310.49, 2325.72],
  ['2013/5/31', 2320.74, 2300.59, 2299.37, 2325.53],
  ['2013/6/3', 2300.21, 2299.25, 2294.11, 2313.43],
  ['2013/6/4', 2297.1, 2272.42, 2264.76, 2297.1],
  ['2013/6/5', 2270.71, 2270.93, 2260.87, 2276.86],
  ['2013/6/6', 2264.43, 2242.11, 2240.07, 2266.69],
  ['2013/6/7', 2242.26, 2210.9, 2205.07, 2250.63],
  ['2013/6/13', 2190.1, 2148.35, 2126.22, 2190.1]
]);
function splitData(rawData: any) {
  const categoryData = [];
  const values = [];
  for (var i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].splice(0, 1)[0]);
    values.push(rawData[i]);
  }
  return {
    categoryData: categoryData,
    values: values
  };
}
function calculateMA(dayCount: any) {
  var result = [];
  for (var i = 0, len = data0.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += +data0.values[i - j][1];
    }
    result.push(sum / dayCount);
  }
  return result;
}

const getK = () => {
  return {
    title: {
      text: "A股",
      left: 0,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    legend: {
      data: ["日K", "MA5", "MA10", "MA20", "MA30"],
      right: 0
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
    },
    xAxis: {
      type: "category",
      data: data0.categoryData,
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      min: "dataMin",
      max: "dataMax",
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: true,
      },
    },
    series: [
      {
        name: "日K",
        type: "candlestick",
        data: data0.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: upBorderColor,
          borderColor0: downBorderColor,
        },
        markPoint: {
          label: {
            formatter: function (param: any) {
              return param != null ? Math.round(param.value) + "" : "";
            },
          },
          data: [
            {
              name: "Mark",
              coord: ["2013/5/31", 2300],
              value: 2300,
              itemStyle: {
                color: "rgb(41,60,85)",
              },
            },
            {
              name: "highest value",
              type: "max",
              valueDim: "highest",
            },
            {
              name: "lowest value",
              type: "min",
              valueDim: "lowest",
            },
            {
              name: "average value on close",
              type: "average",
              valueDim: "close",
            },
          ],
          tooltip: {
            formatter: function (param: any) {
              return param.name + "<br>" + (param.data.coord || "");
            },
          },
        },
        markLine: {
          symbol: ["none", "none"],
          data: [
            [
              {
                name: "from lowest to highest",
                type: "min",
                valueDim: "lowest",
                symbol: "circle",
                symbolSize: 10,
                label: {
                  show: false,
                },
                emphasis: {
                  label: {
                    show: false,
                  },
                },
              },
              {
                type: "max",
                valueDim: "highest",
                symbol: "circle",
                symbolSize: 10,
                label: {
                  show: false,
                },
                emphasis: {
                  label: {
                    show: false,
                  },
                },
              },
            ],
            {
              name: "min line on close",
              type: "min",
              valueDim: "close",
            },
            {
              name: "max line on close",
              type: "max",
              valueDim: "close",
            },
          ],
        },
      },
      {
        name: "MA5",
        type: "line",
        data: calculateMA(5),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: "MA10",
        type: "line",
        data: calculateMA(10),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: "MA20",
        type: "line",
        data: calculateMA(20),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: "MA30",
        type: "line",
        data: calculateMA(30),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
    ],
  };
};

const getRadar = () => {
  return {
    color: ['red', 'orange'],
    title: {
      text: '游戏雷达'
    },
    radar: {
      indicator: [
        { name: '原神', max: 6500 },
        { name: '王者荣耀', max: 16000 },
        { name: '和平精英', max: 30000 },
        { name: 'QQ飞车', max: 38000 },
        { name: '战双帕弥什', max: 52000 },
      ]
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: 'Allocated Budget'
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Actual Spending'
          }
        ]
      }
    ]
  };
}

let records: any = ref([]);
let limit = ref(3);
let current = ref(1);
let total: any = ref(0);

const sizeHandler = () => {
  current.value = 1;
  getUser();
}

onMounted(() => {
  getUser();
})

const getUser = async () => {
  let result: any = await reqUser(current.value, limit.value);
  records.value = result.records;
  total.value = result.total;
}

const getPie = () => {
  return {
    title: {
      text: radio.value == '品类' ? arr1[0].name : arr2[0].name,
      subtext: radio.value == '品类' ? arr1[0].value : arr2[0].value,
      top: '46%',
      left: '46%'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'right',
      orient: 'vertical'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: radio.value == '品类' ? arr1 : arr2
      }
    ]
  };
}

let arr1 = [
  { value: 5000, name: '小米' },
  { value: 6000, name: '华为' },
  { value: 7000, name: '苹果' },
  { value: 4500, name: 'oppo' },
  { value: 5000, name: 'vivo' }
]

let arr2 = [
  { value: 1048, name: '红米' },
  { value: 735, name: '荣耀' },
  { value: 580, name: '一加' },
  { value: 484, name: 'oppo' },
  { value: 300, name: 'vivo' }
]

let result2 = arr2.reduce((pre, cur: any) => Math.max(pre, cur), 0)

const handler = (item: any) => {
  console.log(chart.value);
  
chart.value.setOption({
  title: {
    text: item.data.name,
    subtext: item.data.value,
  }
})
}

</script>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: space-between;

  span {
    color: yellowgreen;
  }
}

.radar {
  height: 300px;
}

.pie {
  display: flex;
  justify-content: space-between;
}

.setPie {
  height: 490px;
}
</style>