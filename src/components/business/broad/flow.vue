<template>
  <!-- <div class="flow" id="container"></div> -->
  <div id="graph" class="flow">
    <div id="graph-container" class="graph-container"></div>
  </div>
</template>
<script setup>
import axios from 'axios'
import G6 from '@antv/g6'
import { Graph, Shape } from '@antv/x6'
import insertCss from 'insert-css'
import { nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  list: {
    type: Object,
    default: () => [],
  },
})
// 综控
const flowList_1 = ref({
  nodes: [
    {
      id: '1',
      label: '开始',
      title: '开始',
      x: -5.499021352313164,
      y: 172.77891459074732,
    },
    {
      id: '2',
      label: '创建项目',
      title: '创建项目',
      x: 106.45711108286731,
      y: 172.77891459074732,
    },
    {
      id: '3',
      label: '运行环境分析',
      title: '运行环境分析',
      x: 247.80096593797657,
      y: 32.370907473309614,
    },
    {
      id: '4',
      label: '功能需求分析',
      title: '功能需求分析',
      x: 247.64837951194707,
      y: 98.76539145907466,
    },
    {
      id: '5',
      label: '性能需求分析',
      title: '性能需求分析',
      x: 245.31892475851544,
      y: 172.77891459074726,
    },
    {
      id: '6',
      label: '可靠性需求分析',
      title: '可靠性需求分析',
      x: 245.16633833248608,
      y: 250.05774021352312,
    },
    {
      id: '7',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 365.82994407727506,
      y: 32.370907473309614,
    },
    {
      id: '8',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 364.58892348754443,
      y: 98.76539145907473,
    },
    {
      id: '9',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 366.61320538891715,
      y: 172.7789145907473,
    },
    {
      id: '10',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 368.6374872902898,
      y: 250.05774021352318,
    },
    {
      id: '11',
      label: '仿真测试环境搭建',
      title: '仿真测试环境搭建',
      x: 504.5391713268939,
      y: 84.61574733096084,
    },
    {
      id: '12',
      label: '应用架构设计',
      title: '应用架构设计',
      x: 501.12128240976097,
      y: 206.5203736654804,
    },
    {
      id: '13',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 615.2542831723438,
      y: 84.61574733096086,
    },
    {
      id: '14',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 616.1901309100152,
      y: 206.52037366548038,
    },
    {
      id: '15',
      label: '功能测试用例',
      title: '功能测试用例',
      x: 727.0578291814946,
      y: 21.48656583629894,
    },
    {
      id: '16',
      label: '可靠性测试用例设计',
      title: '可靠性测试用例设计',
      x: 725.816808591764,
      y: 112.91503558718861,
    },
    {
      id: '17',
      label: '详细设计',
      title: '详细设计',
      x: 735.4601296390443,
      y: 206.52037366548043,
    },

    {
      id: '18',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 838.7087887646161,
      y: 21.48656583629893,
    },
    {
      id: '19',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 838.5562023385867,
      y: 112.91503558718861,
    },
    {
      id: '20',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 846.0226550584646,
      y: 233.7312277580071,
    },
    {
      id: '21',
      label: '性能测试用例设计',
      title: '性能测试用例设计',
      x: 924.2373284189117,
      y: 54.13959074733099,
    },
    {
      id: '22',
      label: '编码调试',
      title: '编码调试',
      x: 954.5608985765125,
      y: 252.23460854092522,
    },
    {
      id: '23',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 1032.77557193696,
      y: 54.13959074733096,
    },
    {
      id: '24',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 1053.3032346212506,
      y: 252.23460854092525,
    },
    {
      id: '25',
      label: '问题类型',
      title: '问题类型',
      x: 623.2191535332995,
      y: 280.533896797153,
    },
    {
      id: '26',
      label: '编译链接',
      title: '编译链接',
      x: 1158.576175648195,
      y: 252.23460854092525,
    },
    {
      id: '27',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 1269.4438739196746,
      y: 264.207384341637,
    },
    {
      id: '28',
      label: '功能测试',
      title: '功能测试',
      x: 1140.8560561769193,
      y: 21.486565836298947,
    },
    {
      id: '29',
      label: '性能测试',
      title: '性能测试',
      x: 1142.880338078292,
      y: 86.79261565836299,
    },
    {
      id: '30',
      label: '可靠性测试',
      title: '可靠性测试',
      x: 1141.7105871886117,
      y: 161.96254448398568,
    },
    {
      id: '31',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 1301.5578228266397,
      y: 16.112366548042708,
    },
    {
      id: '32',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 1304.6705388917132,
      y: 74.88781138790037,
    },
    {
      id: '33',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 1309.9601232841892,
      y: 148.90133451957297,
    },
    {
      id: '34',
      label: '分析问题',
      title: '分析问题',
      x: 1381.6441916624299,
      y: 284.95560498220647,
    },
    {
      id: '35',
      label: '结束',
      title: '结束',
      x: 1471.8316408235892,
      y: 144.54759786476873,
    },
  ],
  edges: [
    {
      source: '1',
      target: '2',
    },
    {
      source: '2',
      target: '3',
    },
    {
      source: '2',
      target: '4',
    },
    {
      source: '2',
      target: '5',
    },
    {
      source: '2',
      target: '6',
    },
    {
      source: '3',
      target: '7',
    },
    {
      source: '4',
      target: '8',
    },
    {
      source: '5',
      target: '9',
    },
    {
      source: '6',
      target: '10',
    },
    {
      source: '7',
      target: '11',
    },
    {
      source: '8',
      target: '11',
    },
    {
      source: '9',
      target: '11',
    },
    {
      source: '10',
      target: '11',
    },
    {
      source: '7',
      target: '12',
    },
    {
      source: '8',
      target: '12',
    },
    {
      source: '9',
      target: '12',
    },

    {
      source: '10',
      target: '12',
    },
    {
      source: '11',
      target: '13',
    },
    {
      source: '12',
      target: '14',
    },
    {
      source: '13',
      target: '11',
    },
    {
      source: '14',
      target: '12',
    },
    {
      source: '13',
      target: '15',
    },

    {
      source: '13',
      target: '16',
    },
    {
      source: '13',
      target: '21',
    },
    {
      source: '14',
      target: '17',
    },
    {
      source: '15',
      target: '18',
    },
    {
      source: '16',
      target: '19',
    },
    {
      source: '17',
      target: '20',
    },
    {
      source: '18',
      target: '15',
    },
    {
      source: '18',
      target: '28',
    },
    {
      source: '19',
      target: '16',
    },
    {
      source: '19',
      target: '30',
    },
    {
      source: '20',
      target: '22',
    },
    {
      source: '21',
      target: '23',
    },
    {
      source: '22',
      target: '24',
    },
    {
      source: '23',
      target: '21',
    },
    {
      source: '23',
      target: '29',
    },
    {
      source: '24',
      target: '26',
    },
    {
      source: '25',
      target: '2',
    },
    {
      source: '25',
      target: '12',
    },
    {
      source: '25',
      target: '17',
    },
    {
      source: '26',
      target: '27',
    },
    {
      source: '27',
      target: '28',
    },
    {
      source: '27',
      target: '29',
    },
    {
      source: '27',
      target: '30',
    },
    {
      source: '27',
      target: '17',
    },
    {
      source: '28',
      target: '31',
    },
    {
      source: '29',
      target: '32',
    },
    {
      source: '30',
      target: '33',
    },
    {
      source: '31',
      target: '34',
    },
    {
      source: '32',
      target: '34',
    },
    {
      source: '33',
      target: '34',
    },
    {
      source: '31',
      target: '35',
    },
    {
      source: '32',
      target: '35',
    },
    {
      source: '33',
      target: '35',
    },
    {
      source: '34',
      target: '35',
    },
    {
      source: '34',
      target: '25',
    },
  ],
})
// 火箭
const flowList_2 = ref({
  nodes: [
    {
      id: '1',
      label: '开始',
      title: '开始',
      x: 14.876257956740623,
      y: 384.60035427288824,
    },
    {
      id: '2',
      label: '创建项目',
      title: '创建项目',
      x: 125.21906448918514,
      y: 384.6003542728883,
    },
    {
      id: '3',
      label: '运行环境分析',
      title: '运行环境分析',
      x: 261.9807583743707,
      y: 136.52427345259179,
    },
    {
      id: '4',
      label: '功能需求分析',
      title: '功能需求分析',
      x: 261.98075837437074,
      y: 263.8954995823699,
    },
    {
      id: '5',
      label: '性能需求分析',
      title: '性能需求分析',
      x: 259.1998228635559,
      y: 382.65719346755543,
    },
    {
      id: '6',
      label: '安全性需求分析',
      title: '安全性需求分析',
      x: 257.80935510814845,
      y: 500.29514530948165,
    },
    {
      id: '7',
      label: '可靠性需求分析',
      title: '可靠性需求分析',
      x: 255.0284195973337,
      y: 632.9615167487415,
    },
    {
      id: '8',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 401.52338777037113,
      y: 136.52427345259173,
    },
    {
      id: '9',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 400.1329200149637,
      y: 262.5050318269625,
    },
    {
      id: '10',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 397.35198450414885,
      y: 382.65719346755554,
    },
    {
      id: '11',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 395.9615167487414,
      y: 500.29514530948165,
    },
    {
      id: '12',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 391.79011348251913,
      y: 632.9615167487414,
    },
    {
      id: '13',
      label: '仿真测试环境构建',
      title: '仿真测试环境构建',
      x: 521.7131817860998,
      y: 196.03323340407144,
    },
    {
      id: '14',
      label: '应用架构设计',
      title: '应用架构设计',
      x: 512.928606724395,
      y: 469.2293294573238,
    },
    {
      id: '15',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 653.6534528613009,
      y: 196.05874068867,
    },
    {
      id: '16',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 635.6760782287752,
      y: 456.2473791824387,
    },
    {
      id: '17',
      label: '功能测试用例设计',
      title: '功能测试用例设计',
      x: 782.9923495583535,
      y: 128.96870149248778,
    },
    {
      id: '18',
      label: '安全性测试用例设计',
      title: '安全性测试用例设计',
      x: 778.2491626526747,
      y: 253.61851314905644,
    },
    {
      id: '19',
      label: '安全性设计',
      title: '安全性设计',
      x: 773.5627815505645,
      y: 456.2473791824388,
    },
    {
      id: '20',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 938.4705857281735,
      y: 128.96870149248767,
    },
    {
      id: '21',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 933.4619405036917,
      y: 253.61851314905635,
    },
    {
      id: '22',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 906.0435273427969,
      y: 456.24737918243875,
    },
    {
      id: '23',
      label: '性能测试用例设计',
      title: '性能测试用例设计',
      x: 1025.9465976270103,
      y: 193.0799418228294,
    },
    {
      id: '24',
      label: '可靠性测试用例设计',
      title: '可靠性测试用例设计',
      x: 1034.6237887205966,
      y: 340.47283232652075,
    },
    {
      id: '25',
      label: '任务算法设计',
      title: '任务算法设计',
      x: 1023.3850413176201,
      y: 455.51547719201113,
    },
    {
      id: '26',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 1149.4440754224597,
      y: 193.0799418228294,
    },
    {
      id: '27',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 1157.5395766479448,
      y: 340.47283232652086,
    },
    {
      id: '28',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 1148.164971566425,
      y: 455.6797033456168,
    },
    {
      id: '29',
      label: '代码生成',
      title: '代码生成',
      x: 1267.881953968234,
      y: 456.0351159590722,
    },
    {
      id: '30',
      label: '编译链接',
      title: '编译链接',
      x: 1388.8393327187646,
      y: 456.03511595907224,
    },
    {
      id: '31',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 1491.8968074310485,
      y: 516.3628013820751,
    },
    {
      id: '32',
      label: '功能测试',
      title: '功能测试',
      x: 1512.1709046051806,
      y: 128.90270048162344,
    },
    {
      id: '33',
      label: '性能测试',
      title: '性能测试',
      x: 1511.7637265253277,
      y: 193.3368138118782,
    },
    {
      id: '34',
      label: '安全性测试',
      title: '安全性测试',
      x: 1511.7637265253277,
      y: 266.98040316140265,
    },
    {
      id: '35',
      label: '可靠性测试',
      title: '可靠性测试',
      x: 1511.7637265253275,
      y: 340.2438274339624,
    },
    {
      id: '36',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 1634.1395480856133,
      y: 126.25793767584057,
    },
    {
      id: '37',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 1633.2271617462295,
      y: 192.20262575517773,
    },
    {
      id: '38',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 1632.4868880456318,
      y: 267.13273238048765,
    },
    {
      id: '39',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
      x: 1629.6158728890305,
      y: 340.5910476299548,
    },
    {
      id: '40',
      label: '结束',
      title: '结束',
      x: 1941.3212290096508,
      y: 382.360715121114,
    },
    {
      id: '41',
      label: '分析问题',
      title: '分析问题',
      x: 1705.4895633613378,
      y: 567.4767381264305,
    },
    {
      id: '42',
      label: '问题类型',
      title: '问题类型',
      x: 993.3106878702251,
      y: 570.6599202047275,
    },
  ],
  edges: [
    {
      source: '1',
      target: '2',
    },
    {
      source: '2',
      target: '3',
    },
    {
      source: '2',
      target: '4',
    },
    {
      source: '2',
      target: '5',
    },
    {
      source: '2',
      target: '6',
    },
    {
      source: '2',
      target: '7',
    },
    {
      source: '3',
      target: '8',
    },
    {
      source: '4',
      target: '9',
    },
    {
      source: '5',
      target: '10',
    },
    {
      source: '6',
      target: '11',
    },
    {
      source: '7',
      target: '12',
    },
    {
      source: '8',
      target: '3',
    },
    {
      source: '9',
      target: '4',
    },
    {
      source: '10',
      target: '5',
    },
    {
      source: '11',
      target: '6',
    },
    {
      source: '12',
      target: '7',
    },
    {
      source: '8',
      target: '13',
    },
    {
      source: '9',
      target: '13',
    },
    {
      source: '10',
      target: '13',
    },
    {
      source: '11',
      target: '13',
    },
    {
      source: '12',
      target: '13',
    },
    {
      source: '8',
      target: '14',
    },
    {
      source: '9',
      target: '14',
    },
    {
      source: '10',
      target: '14',
    },
    {
      source: '11',
      target: '14',
    },
    {
      source: '12',
      target: '14',
    },
    {
      source: '13',
      target: '15',
    },
    {
      source: '14',
      target: '16',
    },
    {
      source: '15',
      target: '13',
    },
    {
      source: '16',
      target: '14',
    },
    {
      source: '15',
      target: '17',
    },
    {
      source: '15',
      target: '23',
    },
    {
      source: '15',
      target: '18',
    },
    {
      source: '15',
      target: '24',
    },
    {
      source: '16',
      target: '19',
    },
    {
      source: '17',
      target: '20',
    },
    {
      source: '18',
      target: '21',
    },
    {
      source: '19',
      target: '22',
    },
    {
      source: '20',
      target: '17',
    },
    {
      source: '20',
      target: '32',
    },
    {
      source: '21',
      target: '18',
    },
    {
      source: '21',
      target: '34',
    },
    {
      source: '22',
      target: '25',
    },
    {
      source: '23',
      target: '26',
    },
    {
      source: '24',
      target: '27',
    },
    {
      source: '25',
      target: '28',
    },
    {
      source: '26',
      target: '33',
    },
    {
      source: '26',
      target: '23',
    },
    {
      source: '27',
      target: '35',
    },
    {
      source: '27',
      target: '24',
    },
    {
      source: '28',
      target: '29',
    },
    {
      source: '29',
      target: '30',
    },
    {
      source: '30',
      target: '31',
    },
    {
      source: '31',
      target: '32',
    },
    {
      source: '31',
      target: '33',
    },
    {
      source: '31',
      target: '34',
    },
    {
      source: '31',
      target: '35',
    },
    {
      source: '31',
      target: '25',
    },
    {
      source: '32',
      target: '36',
    },
    {
      source: '33',
      target: '37',
    },
    {
      source: '34',
      target: '38',
    },
    {
      source: '35',
      target: '39',
    },
    {
      source: '36',
      target: '40',
    },
    {
      source: '37',
      target: '40',
    },
    {
      source: '38',
      target: '40',
    },
    {
      source: '39',
      target: '40',
    },
    {
      source: '36',
      target: '41',
    },
    {
      source: '37',
      target: '41',
    },
    {
      source: '38',
      target: '41',
    },
    {
      source: '39',
      target: '41',
    },
    {
      source: '41',
      target: '42',
    },
    {
      source: '42',
      target: '25',
    },
    {
      source: '42',
      target: '14',
    },
    {
      source: '42',
      target: '2',
    },
  ],
})
const flowList = ref({
  nodes: [],
  edges: [],
})
let graph = null
const showStatus = ref(0)

const graphData = ref({})
const graphDataStatusList = ref([])
const projectType = ref([])

watch(
  () => props.list,
  (n, o) => {
    if (JSON.stringify(n) == '{}') {
      if (graph !== null) {
        graph.dispose()
      }
    } else {
      showStatus.value = n.showStatus
      projectType.value[0] = n.rank
      projectType.value[1] = o.rank
      graphDataStatusList.value = n.flowList
      nextTick(() => {
        if (n.rank === 'A') {
          getFlow('flow',o)
          
        } else {
          getFlow('comflow',o)
        }
      })
    }
  }
)
const init = (o) => {
  if (JSON.stringify(o) === '{}') {
    createGraphic()
  } else {
    attrsNode()
  }
}
// 绝对定位连接桩
const absolutePorts = {
  groups: {
    top: {
      position: 'top',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    right: {
      position: 'right',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    bottom: {
      position: 'bottom',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    left: {
      position: 'left',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
  },
  items: [
    {
      group: 'top',
    },
    {
      group: 'right',
    },
    {
      group: 'bottom',
    },
    {
      group: 'left',
    },
  ],
}

// 初始化创建画布
const createGraphic = () => {
  // #region 构建自定义图形
  // 菱形
  Graph.registerNode(
    'custom-polygon-rhombus',
    {
      inherit: 'polygon',
      width: 100,
      height: 60,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#333',
          fill: '#fff',
          refPoints: '0,10 10,0 20,10 10,20',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
        },
      },
      ports: { ...absolutePorts },
    },
    true
  )
  // 矩形
  Graph.registerNode(
    'custom-rect',
    {
      inherit: 'rect',
      width: 100,
      height: 70,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#333',
          fill: '#fff',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
        },
      },
      ports: { ...absolutePorts },
    },
    true
  )
  // #endregion
  const parentDom = document.getElementById('graph')
  const graphDom = document.getElementById('graph-container')
  graph = new Graph({
    container: graphDom,
    width: parentDom.clientWidth,
    height: parentDom.clientHeight,
    mousewheel: {
      enabled: true,
      modifiers: ['ctrl', 'meta'],
    },
    interacting: false, // 禁止节点边交互
    connecting: {
      router: 'manhattan',
      connector: {
        name: 'rounded',
        args: {
          radius: 0,
        },
      },
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false,
    },
  })
  insertCss(`
    #container {
      display: flex;
      border: 1px solid #dfe3e8;
    }
    #graph-container {
      width: calc(100% - 180px);
      height: 100%;
    }
  `)
  attrsNode()
  console.log('2')
}

function attrsNode() {
  if (Object.keys(graphData.value).length) {
    if (projectType.value[0] !== projectType.value[1]) {
      graph.fromJSON(graphData.value.cells)
    }
    graph.zoomToFit()
    const data = graph.getNodes()
    data.forEach((item, index) => {
      graphDataStatusList.value.forEach((status) => {
        if (showStatus.value === 1) {
          item.attr({
            body: { fill: '#f4fefb',stroke:'#669f88' },
            label: { fill: '#333' },
          })
        } else {
          if (index + 1 === status.serial) {
            if (status.status === 1) {
              item.attr({
                body: { fill: '#f4fefb',stroke:'#669f88' },
                label: { fill: '#333' },
              })
            } else if (status.status === 2) {
              item.attr({
                body: { fill: '#a0d8ef',stroke:'#2ca9e1' },
                label: { fill: '#fff' },
              })
              // {
              //   type: 'linearGradient',
              //   stops: [
              //     { offset: '0%', color: '#457fca' },
              //     { offset: '100%', color: '#5691c8' },
              //   ],
              // }
            } else if (status.status === 3) {
              item.attr({
                body: { fill: '#fff',stroke:'#669f88' },
                label: { fill: '#333' },
              })
            } else if (status.status === 4) {
              item.attr({
                body: { fill: '#c9171e',stroke:'#e9546b' },
                label: { fill: '#fff' },
              })
            }
          }
        }
      })
    })
  }
}
function getFlow(json,o) {
  axios.get(`http://192.168.89.124:8080/mock/flow/${json}.json`).then((res) => {
    graphData.value = res
    console.log('1')
    init(o)
  })
}
</script>
<style lang="scss" scoped>
.flow {
  width: 100%;
  height: 300px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  flex: 1;
  display: flex;
  overflow: hidden;
}
.graph-container {
  width: 100%;
  height: 100% !important;
  flex: 1 1;
}
</style>
