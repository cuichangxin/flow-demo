<template>
  <div class="flow" id="container"></div>
</template>
<script setup>
import G6 from '@antv/g6'
import { watch } from 'vue';
let props = defineProps({
  list: {
    type: Object,
    default: () => []
  }
})
// 综控
const flowList_1 = ref({
  nodes: [
    {
      id: '1',
      label: '开始',
      title: '开始'
    },
    {
      id: '2',
      label: '创建项目',
      title: '创建项目'
    },
    {
      id: '3',
      label: '运行环境分析',
      title: '运行环境分析'
    },
    {
      id: '4',
      label: '功能需求分析',
      title: '功能需求分析'
    },
    {
      id: '5',
      label: '性能需求分析',
      title: '性能需求分析'
    },
    {
      id: '6',
      label: '可靠性需求分析',
      title: '可靠性需求分析'
    },
    {
      id: '7',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '8',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '9',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '10',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '11',
      label: '仿真测试环境搭建',
      title: '仿真测试环境搭建'
    },
    {
      id: '12',
      label: '应用架构设计',
      title: '应用架构设计'
    },
    {
      id: '13',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '14',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '15',
      label: '功能测试用例',
      title: '功能测试用例'
    },
    {
      id: '16',
      label: '可靠性测试用例设计',
      title: '可靠性测试用例设计'
    },
    {
      id: '17',
      label: '详细设计',
      title: '详细设计'
    },

    {
      id: '18',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '19',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '20',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '21',
      label: '性能测试用例设计',
      title: '性能测试用例设计'
    },
    {
      id: '22',
      label: '编码调试',
      title: '编码调试'
    },
    {
      id: '23',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '24',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '25',
      label: '问题类型',
      title: '问题类型'
    },
    {
      id: '26',
      label: '编译链接',
      title: '编译链接'
    },
    {
      id: '27',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '28',
      label: '功能测试',
      title: '功能测试'
    },
    {
      id: '29',
      label: '性能测试',
      title: '性能测试'
    },
    {
      id: '30',
      label: '可靠性测试',
      title: '可靠性测试'
    },
    {
      id: '31',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '32',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '33',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '34',
      label: '分析问题',
      title: '分析问题'
    },
    {
      id: '35',
      label: '结束',
      title: '结束'
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


  ],
})
// 火箭
const flowList_2 = ref({
  nodes: [
    {
      id: '1',
      label: '开始',
      title: '开始'
    },
    {
      id: '2',
      label: '创建项目',
      title: '创建项目'
    },
    {
      id: '3',
      label: '运行环境分析',
      title: '运行环境分析'
    },
    {
      id: '4',
      label: '功能需求分析',
      title: '功能需求分析'
    },
    {
      id: '5',
      label: '性能需求分析',
      title: '性能需求分析'
    },
    {
      id: '6',
      label: '安全性需求分析',
      title: '安全性需求分析'
    }, {
      id: '7',
      label: '可靠性需求分析',
      title: '可靠性需求分析'
    },
    {
      id: '8',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '9',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '10',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '11',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '12',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '13',
      label: '仿真测试环境构建',
      title: '仿真测试环境构建'
    },
    {
      id: '14',
      label: '应用架构设计',
      title: '应用架构设计'
    },
    {
      id: '15',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '16',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '17',
      label: '功能测试用例设计',
      title: '功能测试用例设计'
    },
    {
      id: '18',
      label: '安全性测试用例设计',
      title: '安全性测试用例设计'
    },
    {
      id: '19',
      label: '安全性设计',
      title: '安全性设计'
    },
    {
      id: '20',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '21',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '22',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '23',
      label: '性能测试用例设计',
      title: '性能测试用例设计'
    },
    {
      id: '24',
      label: '可靠性测试用例设计',
      title: '可靠性测试用例设计'
    },
    {
      id: '25',
      label: '任务算法设计',
      title: '任务算法设计'
    },
    {
      id: '26',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '27',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '28',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '29',
      label: '代码生成',
      title: '代码生成'
    },
    {
      id: '30',
      label: '编译链接',
      title: '编译链接'
    },
    {
      id: '31',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '32',
      label: '功能测试',
      title: '功能测试'
    },
    {
      id: '33',
      label: '性能测试',
      title: '性能测试'
    },
    {
      id: '34',
      label: '安全性测试',
      title: '安全性测试'
    },
    {
      id: '35',
      label: '可靠性测试',
      title: '可靠性测试'
    },
    {
      id: '36',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '37',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '38',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '39',
      label: '质量门',
      title: '质量门',
      type: 'diamond',
    },
    {
      id: '40',
      label: '结束',
      title: '结束'
    },
    {
      id: '41',
      label: '分析问题',
      title: '分析问题'
    },
    {
      id: '42',
      label: '问题类型',
      title: '问题类型'
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
    }
  ]
})
const flowList = ref({
  nodes: [],
  edges: []
})
let graph = null
watch(() => props.list, (n) => {
  if (JSON.stringify(n) == '{}') {
    flowList_1.value.nodes.forEach(item => {
      item.status = '1'
    })
    flowList_2.value.nodes.forEach(item => {
      item.status = '1'
    })
    flowList.value = {
      nodes: [],
      edges: []
    }
    if (graph !== null) {
      graph.destroy()
    }
  } else {
    let select = props.list.rank == 'A' ? flowList_2.value : props.list.rank == 'C' ? flowList_1.value : ''
    if (select !== '') {
      select.nodes.forEach(item => {
        n.flowList.forEach(v => {
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
})

/**
 * 进行中 #91d9ff
 * 已完成 #fefefe
 * 未开始 #b5b5b5
*/
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
      type: 'dagre',
      rankdir: 'LR',
      nodesepFunc: () => 2,
      ranksepFunc: () => 1,
      ranksep: 40,
    },
    defaultNode: {
      size: [50, 30],
      type: 'rect',
      style: {
        lineWidth: 0,
        stroke: '#5B8FF9',
        fill: '#b5b5b5',
      },
      labelCfg: {
        style: {
          fontSize: 8
        }
      }
    },
    defaultEdge: {
      type: 'polyline',
      color: '#e2e2e2',
      style: {
        endArrow: true,
        radius: 15,
        offset:45,
        lineWidth:2,
        stroke:'#73879a'
      },
    },
  });
  graph.node((node) => {
    // status 1暗 2蓝 3白 4红
    if (node.status == 1) {
      return {
        style: {
          fill: "#b5b5b5",
          stroke: "#ea7171",
        },
      };
    } else if (node.status == 2) {
      return {
        style: {
          fill: "#91d9ff",
          stroke: "#ea7171",
        },
      };
    } else if (node.status == 3) {
      return {
        style: {
          fill: '#fff',
          stroke: "#ea7171",
        }
      }
    } else if (node.status == 4) {
      return {
        style: {
          fill: '#ff3636',
          stroke: "#ea7171",
        }
      }
    }
    // return {
    //   style: {
    //     fill: "#b5b5b5",
    //     stroke: "#ea7171",
    //   },
    // };
  });
  if (Object.keys(flowList.value).length) {
    flowList.value.nodes.forEach(item => {
      item.label = superLongTextHandle(item.title, 60, 15)
    })
  }
  graph.data(flowList.value)
  graph.render();
}
// 节点字体换行
function superLongTextHandle(str, maxWidth, fontSize) {
  let currentWidth = 0;
  let res = str;
  // 区分汉字和字母
  const pattern = new RegExp("[\u4E00-\u9FA5]+");
  str.split("").forEach((letter, i) => {
    if (currentWidth > maxWidth) return;
    if (pattern.test(letter)) {
      // 中文字符
      currentWidth += fontSize;
    } else {
      // 根据字体大小获取单个字母的宽度
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth) {
      res = `${str.substr(0, i)}\n${superLongTextHandle(
        str.substr(i),
        maxWidth,
        fontSize
      )}`
    }
  });
  return res;
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
