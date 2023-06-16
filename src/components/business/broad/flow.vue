<template>
  <div class="flow" id="container"></div>
</template>
<script setup>
import G6 from '@antv/g6'

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
watch(
  () => props.list,
  (n) => {
    if (JSON.stringify(n) == '{}') {
      flowList_1.value.nodes.forEach((item) => {
        item.status = '1'
      })
      flowList_2.value.nodes.forEach((item) => {
        item.status = '1'
      })
      flowList.value = {
        nodes: [],
        edges: [],
      }
      if (graph !== null) {
        graph.destroy()
      }
    } else {
      let select = props.list.rank == 'A' ? flowList_2.value : props.list.rank == 'C' ? flowList_1.value : ''
      if (select !== '') {
        select.nodes.forEach((item) => {
          n.flowList.forEach((v) => {
            if (item.status == undefined) {
              item.status = '1'
            }
            if (item.id == v.serial) {
              item.status = v.status
            }
          })
        })
        flowList.value = select
      }
      if (graph !== null) {
        graph.destroy()
      }
      initG6()
    }
  }
)
const initG6 = () => {
  const container = document.getElementById('container')
  const width = container.clientWidth
  const height = container.clientHeight
  graph = new G6.Graph({
    container: 'container',
    width,
    height,
    fitView: true,
    modes: {
      default: ['drag-canvas', 'zoom-canvas'],
    },
    layout: {
      type: '',
    },
    defaultNode: {
      size: [80, 50],
      type: 'rect',
      style: {
        lineWidth: 0,
        stroke: '#5B8FF9',
        fill: '#b5b5b5',
      },
      labelCfg: {
        style: {
          fontSize: 12,
        },
      },
    },
    defaultEdge: {
      type: 'polyline',
      color: '#e2e2e2',
      style: {
        endArrow: true,
        radius: 5,
        // offset:45,
        lineWidth: 2,
        stroke: '#73879a',
      },
    },
  })
  graph.node((node) => {
    // status 1暗 2蓝 3白 4红
    if (node.status == 1) {
      return {
        style: {
          fill: '#b5b5b5',
          stroke: '#ea7171',
        },
      }
    } else if (node.status == 2) {
      return {
        style: {
          fill: '#91d9ff',
          stroke: '#ea7171',
        },
      }
    } else if (node.status == 3) {
      return {
        style: {
          fill: '#fff',
          stroke: '#ea7171',
        },
      }
    } else if (node.status == 4) {
      return {
        style: {
          fill: '#ff3636',
          stroke: '#ea7171',
        },
      }
    } else {
      return {
        style: {
          fill: '#b5b5b5',
          stroke: '#ea7171',
        },
      }
    }
  })
  if (Object.keys(flowList.value).length) {
    flowList.value.nodes.forEach((item) => {
      item.label = superLongTextHandle(item.title, 80, 15)
    })
  }
  graph.data(flowList.value)
  graph.render()
}
// 节点字体换行
function superLongTextHandle(str, maxWidth, fontSize) {
  let currentWidth = 0
  let res = str
  // 区分汉字和字母
  const pattern = new RegExp('[\u4E00-\u9FA5]+')
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth) return
    if (pattern.test(letter)) {
      // 中文字符
      currentWidth += fontSize
    } else {
      // 根据字体大小获取单个字母的宽度
      currentWidth += G6.Util.getLetterWidth(letter, fontSize)
    }
    if (currentWidth > maxWidth) {
      res = `${str.substr(0, i)}\n${superLongTextHandle(str.substr(i), maxWidth, fontSize)}`
    }
  })
  return res
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
}
</style>
