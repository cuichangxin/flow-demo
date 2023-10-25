<template>
  <div class="affirm_info">
    <steps :isActive="2"></steps>
    <div class="scrollbar">
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
              <div class="name_item">{{ LEVELMAP[projectList.level] }}</div>
            </div>
          </div>
          <div class="affirm_item">
            <span class="label">进&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度:</span>
            <div class="content">
              <div class="name_item">
                生产线预计在<em class="time">{{ timeQuery }}</em>完成，比计划完成时间<em class="time">提前0</em>天
              </div>
            </div>
          </div>
        </div>
        <div class="flow">
          <span class="label" v-if="!fullFlag">活动流程:</span>
          <div class="flow_info">
            <div class="full_box" @click="fullScreen">
              <el-icon><FullScreen /></el-icon>
            </div>
            <div id="graph" class="graph_box"></div>
          </div>
        </div>
        <div v-if="!fullFlag" class="tool">
          <span class="label">工具情况:</span>
          <div class="tool_info">
            <el-table :data="tableList" border>
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
    </div>
  </div>
</template>
<script setup>
import steps from './common/steps.vue'
import { allStore } from '@/store'
import G6 from '@antv/g6'
import { fittingString, formatTime } from '@/utils/utils'
import Cookies from 'js-cookie'
import NProgress from 'nprogress'
import { LEVELMAP } from '@/utils/map'
import { useKeepAliver } from '@/store/keepAlive'
import { FullScreen } from '@element-plus/icons-vue'

const { removeKeepAlive } = useKeepAliver()

const { proxy } = getCurrentInstance()
const store = allStore()
const router = useRouter()
const route = useRoute()
const timeQuery = formatTime(route.query.eTime,'h')
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
      finishTime: formatTime(projectList.value.eTime,'-'),
      createTime: formatTime(),
      userId: Cookies.get('userId'),
    })
    .then((res) => {
      if (res.success) {
        proxy.$modal.msgSuccess('创建成功，稍后返回列表页')
        NProgress.start()

        // 创建成功后看板展示切换到当前项目
        proxy.$axios.projectChange({ type: projectList.value.type }).then((res) => {
          console.log('切换项目成功')
        })
        removeKeepAlive('configMessage')
        setTimeout(() => {
          router.push({
            name: 'pmList',
          })
        }, 2000)
      } else {
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
      default: ['drag-canvas'],
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
        lineWidth: 1,
        stroke: '#5B8FF9',
        fill: '#fff',
      },
      labelCfg: {
        style: {
          fontSize: 12,
        },
      },
    },
    defaultEdge: {
      type: 'polyline',
      color: '#dedede',
      style: {
        endArrow: {
          path: 'M 0,0 L 6,3 L 6,-3 Z',
          fill: '#e2e2e2',
        },
        radius: 0,
        lineWidth: 2,
        stroke: '#dedede',
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
      } else {
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
.scrollbar {
  background-color: var(--header-bg-color);
  border-radius: 4px;
  margin-top: 10px;
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
  color: var(--my-text-bg-color);
}

.flex {
  display: flex;
  flex-wrap: wrap;
}

.name_item {
  min-width: 280px;
  padding: 0 20px;
  height: 30px;
  background-color: var(--my-bg-color-2);
  margin-left: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
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
    position: relative;

    .full_box {
      position: absolute;
      right: 10px;
      top: 5px;
      cursor: pointer;
    }
  }
  .flow_info{
    border: 1px solid var(--el-border-color);
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
