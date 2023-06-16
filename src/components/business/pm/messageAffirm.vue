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
              <div class="name_item">{{ LEVELMAP[projectList.level]}}</div>
            </div>
          </div>
          <div class="affirm_item">
            <span class="label">进&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度:</span>
            <div class="content" style="width: 99%">
              <div class="name_item" style="width: 99%">
                生产线预计在<em class="time">2023年06月30日</em>完成，比计划完成时间<em class="time">提前5</em>天
              </div>
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
              <el-table-column align="center" prop="name" label="活动名称"> </el-table-column>
              <el-table-column align="center" prop="post" label="岗位"> </el-table-column>
              <el-table-column align="center" prop="tool" label="工具"> </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-if="!fullFlag" class="affirm">
          <el-button class="button" type="info" @click="goBack">返回上一步</el-button>
          <el-button :disabled="createBtnFlag" :loading="loading" class="button" type="primary" @click="enter">
            <span v-if="!loading">确认</span>
            <span v-else>创建中</span>
          </el-button>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import steps from './common/steps.vue'
import { allStore } from '../../../store'
import G6 from '@antv/g6'
import { fittingString, formatTime } from '@/utils/utils'
import Cookies from 'js-cookie'
import NProgress from 'nprogress'
import { LEVELMAP } from '@/utils/map'

const { proxy } = getCurrentInstance()
const store = allStore()
const router = useRouter()
const configHeight = ref(0)
// 工具情况
const tableList = ref([])
const projectList = ref({})
const fullFlag = ref(false)

const flowList = ref({
  nodes: [],
  edges: [],
})
let graph = null
const createBtnFlag = ref(false)

const loading = ref(false)

function tableHeaderCellStyle() {
  return {
    background: '#efefef',
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
  loading.value = true
  proxy.$axios
    .createProject({
      optionName: projectList.value.name,
      type: projectList.value.type,
      level: projectList.value.level,
      deLanguage: projectList.value.codeLang,
      finishTime: formatTime(projectList.value.eTime),
      createTime: formatTime(),
      userId: Cookies.get('userId'),
    })
    .then((res) => {
      if (res.success) {
        proxy.$modal.msgSuccess('创建成功，稍后返回列表页')
        NProgress.start()
        
        // 创建成功后看板展示切换到当前项目
        proxy.$axios.projectChange({type:projectList.value.type}).then((res) => {
          console.log('切换项目成功')
        })

        setTimeout(() => {
          router.push({
            name: 'pmList',
          })
        }, 2000)
      }else {
        loading.value = false
        proxy.$modal.msgError('创建失败，请稍后再试')
      }
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
          fontSize: 8,
        },
      },
    },
    defaultEdge: {
      type: 'polyline',
      color: '#e2e2e2',
      style: {
        endArrow: true,
        radius: 2,
        lineWidth: 1,
        stroke: '#73879a',
      },
    },
  })
  if (Object.keys(flowList.value).length) {
    flowList.value.nodes.forEach((item) => {
      item.label = fittingString(item.title, 60, 15)
    })
  }
  graph.data(flowList.value)
  graph.render()
}
onMounted(() => {
  configHeight.value = window.innerHeight - 195
  window.addEventListener('resize', () => {
    configHeight.value = window.innerHeight - 195
  })
  proxy.$axios
    .projectSubTool({
      type: store.projectInfo.type,
      level: store.projectInfo.level,
      deLanguage: store.projectInfo.codeLang,
    })
    .then((res) => {
      if (res.data !== null) {
        flowList.value.nodes = res.data.nodes
        flowList.value.edges = res.data.edges
        tableList.value = res.data.attr
        initG6()
      }else {
        proxy.$modal.msgWarning('当前项目暂无活动流程数据')
        createBtnFlag.value = true
      }
      projectList.value = store.projectInfo
      if (!Object.keys(projectList.value).length) {
        createBtnFlag.value = true
      }
    })
})
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})
</script>
<style lang="scss" scoped>
.affirm_info {
  width: 100%;
  height: 100%;
}
.scrollbar {
  height: 680px;
  background-color: #fff;
  margin: 10px 8px 0;
  border-radius: 8px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
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
