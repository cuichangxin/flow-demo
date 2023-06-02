<template>
  <div class="affirm_info">
    <steps :isActive="2"></steps>
    <el-scrollbar class="scrollbar" :style="{ height: `${configHeight}px` }">
      <div class="wrapper">
        <div v-if="!fullFlag" class="flex">
          <div class="affirm_item">
            <span class="label">项目名称:</span>
            <div class="content">
              <div class="name_item">{{ projectList.name }}</div>
            </div>
          </div>
          <div class="affirm_item">
            <span class="label">安全关键等级:</span>
            <div class="content">
              <div class="name_item">{{ projectList.level === 1 ? 'A级' : '' }}</div>
            </div>
          </div>
          <div class="affirm_item">
            <span class="label">进&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度:</span>
            <div class="content" style="width:99%">
              <div class="name_item" style="width:99%">生产线预计在<em class="time">2023年06月30日</em>完成，比计划完成时间<em class="time">提前5</em>天</div>
            </div>
          </div>
        </div>
        <div class="flow">
          <span class="label" v-if="!fullFlag">活动流程:</span>
          <div class="flow_info" :style="{ height: fullFlag ? `${configHeight - 35}px` : '' }">
            <div class="full_box" @click="fullScreen">
              <img v-if="!fullFlag" class="img" src="../../../assets/image/quanping_o.png" />
              <img v-else class="img" src="../../../assets/image/quxiaoquanping_o.png" />
            </div>
            <div id="graph" class="graph_box"></div>
          </div>
        </div>
        <div v-if="!fullFlag" class="tool">
          <span class="label">工具情况:</span>
          <div class="tool_info">
            <el-table :data="tableList" border :header-cell-style="tableHeaderCellStyle">
              <el-table-column align="center" label="序号" width="80">
                <template #default="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="name" label="活动名称">
              </el-table-column>
              <el-table-column align="center" prop="post" label="岗位">
              </el-table-column>
              <el-table-column align="center" prop="tool" label="工具">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-if="!fullFlag" class="affirm">
          <el-button class="button" type="info" @click="goBack">返回上一步</el-button>
          <el-button class="button" type="primary" @click="enter">确认</el-button>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import steps from './common/steps.vue'
import { allStore } from '../../../store';
import G6 from '@antv/g6'
import { fittingString, formatTime } from '@/utils/utils'
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'

const { proxy } = getCurrentInstance()
const store = allStore()
const router = useRouter()
const configHeight = ref(0)
// 工具情况
const tableList = ref([
  // {
  //   name: '',
  //   post: '',
  //   tool: ''
  // }
])
const projectList = ref({})
const fullFlag = ref(false)

const flowList = ref({
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
let graph = null

function tableHeaderCellStyle() {
  return {
    "background": "#efefef"
  }
}

const fullScreen = () => {
  fullFlag.value = !fullFlag.value
  graph.destroy()
  setTimeout(() => {
    initG6()
  }, 300)
}
const goBack = () => {
  router.go(-1)
}
const enter = () => {
  proxy.$axios.createProject({
    optionName: projectList.value.name,
    type: projectList.value.type,
    level: projectList.value.level,
    deLanguage: projectList.value.codeLang,
    finishTime: formatTime(projectList.value.eTime),
    createTime: formatTime(),
    userId: Cookies.get('userId')
  }).then((res) => {
    ElMessage({ type: 'success', message: '创建成功，稍后返回列表页' })
    NProgress.start()
    setTimeout(() => {
      router.push({
        name: 'pmList'
      })
    }, 2000)
  })
}
const initG6 = () => {
  const container = document.getElementById('graph')
  graph = new G6.Graph({
    container: 'graph',
    width: container.clientWidth,
    height: container.clientHeight,
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
        offset: 45,
        lineWidth: 2,
        stroke: '#73879a'
      },
    },
  })
  if (Object.keys(flowList.value).length) {
    flowList.value.nodes.forEach(item => {
      item.label = fittingString(item.title, 60, 15)
    })
  }
  graph.data(flowList.value)
  graph.render();
}
onMounted(() => {
  configHeight.value = window.innerHeight - 235
  window.addEventListener('resize', () => {
    configHeight.value = window.innerHeight - 235
  })
  proxy.$axios.projectSubTool({
    type: store.projectInfo.type,
    level: store.projectInfo.level,
    deLanguage: store.projectInfo.codeLang
  }).then((res) => {
    console.log(res);
    flowList.value.nodes = res.data.nodes
    flowList.value.edges = res.data.edges
    tableList.value = res.data.attr
    projectList.value = store.projectInfo
    initG6()
  })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => { })
})

</script>
<style lang="scss" scoped>
.affirm_info{
  width: 100%;
  height: 100%;
}
.scrollbar {
  height: 680px;
  background-color: #fff;
  margin: 20px 20px 0;
  border-radius: 8px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
}

.wrapper {
  width: 100%;
  padding: 30px;
}

.affirm_item {
  display: flex;
  align-items: center;
  margin: 0 0 10px;

  &:nth-child(1) {
    margin-right: 30%;
  }

  &:nth-child(3) {
    width: 100%;
  }
}

.label {
  font-size: 14px;
}

.flex {
  display: flex;
  flex-wrap: wrap;
}

.name_item {
  min-width: 280px;
  padding: 0 20px;
  height: 30px;
  background-color: #f4f3f3;
  border: 1px solid #b0afaf;
  margin-left: 10px;
  font-size: 14px;
  line-height: 30px;
  border-radius: 3px;

  .time {
    font-style: normal;
    color: #0561f7;
  }
}

.flow,
.tool {
  margin-top: 20px;

  .flow_info,
  .tool_info {
    margin-top: 10px;
    width: 100%;
    height: 500px;
    border: 1px solid #b0afaf;
    position: relative;

    .img {
      width: 30px;
      height: 30px;
      position: absolute;
      right: 10px;
      top: 5px;
      cursor: pointer;
    }
  }

  .tool_info {
    height: auto;
  }
}

.affirm {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;

  .button {
    margin: 0 50px;
  }
}

.graph_box {
  width: 100%;
  height: 100%;
}
</style>
