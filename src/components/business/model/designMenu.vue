<template>
  <el-aside class="design_menu" :class="{ fade: isOut }">
    <h5 v-if="!isOut">领域算法设计工具</h5>
    <el-scrollbar class="menu_info">
      <el-tree
        v-if="tag"
        :data="moduleTree"
        :highlight-current="true"
        :expand-on-click-node="false"
        :indent="12"
        :default-expanded-keys="['1']"
        @node-click="handlerTree"
        node-key="id"
        class="tree"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <img
              v-if="data.children && data.children.length"
              class="sub_img"
              src="../../../assets/images/wenjianjia.png"
            />
            <img v-else class="item_img" src="../../../assets/images/wenjian.png" />
            <span class="node_label">{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
    </el-scrollbar>
    <markPoint :isOut="isOut" :direction="'right'" :color="'#fff'" @hideMenu="hideMenu"></markPoint>
  </el-aside>
</template>
<script setup>
import markPoint from '../../common/mark/markPoiner.vue'
import _ from 'lodash'
import Cookies from 'js-cookie'
import useModelMenu from './useModelMenu.vue'
import { workStore } from '../../../store'

const work = storeToRefs(workStore())
const instance = getCurrentInstance()

instance.proxy.$bus.on('*', (name, val) => {
  // console.log(name, val);
  // 添加节点
  if (name == 'addNodes') {
    interNode(val, moduleTree.value)
  }
  // 节点画布数据写入
  if (name == 'saveData') {
    if (Object.keys(aloneNode.value).length) {
      interTreeNode(val, moduleTree.value)
    }
    // setTimeout(()=>{
    //   localStorage.setItem('modelFile',JSON.stringify(moduleTree.value))
    // },300)
  }
  if (name == 'aloneNode') {
    aloneNode.value = val
  }
  if (name === 'tabSourceChangeSvg') {
    findNode(val, moduleTree.value)
  }
  if (name === 'saveFile') {
    instance.proxy.$axios.saveTaskDetail({
      taskId: Cookies.get('taskId'),
      daTree: JSON.stringify(moduleTree.value),
    })
  }
  if (name === 'contraction') {
    isOut.value = val
  }
  if (name === 'regen') {
    getTask()
  }
})
const moduleTree = ref([
  // {
  //   id: '1',
  //   label: '任务名称',
  //   hide: false,
  //   node: {},
  //   active: false,
  //   children: [
  //     {
  //       id: '1-1',
  //       label: '综合任务',
  //       node: {},
  //       active: false,
  //       hide: false,
  //     },
  //     {
  //       id: '1-2',
  //       label: '姿控任务',
  //       node: {},
  //       hide: false,
  //       active: false,
  //     },
  //     {
  //       id: '1-3',
  //       label: '制导任务',
  //       node: {},
  //       hide: false,
  //       active: false,
  //     },
  //     {
  //       id: '1-4',
  //       label: '数据采集任务',
  //       node: {},
  //       hide: false,
  //       active: false,
  //     },
  //     {
  //       id: '1-5',
  //       label: '遥测任务',
  //       node: {},
  //       hide: false,
  //       active: false,
  //     },
  //     {
  //       id: '1-6',
  //       label: '遥控任务',
  //       node: {},
  //       hide: false,
  //       active: false,
  //     },
  //   ],
  // },
  {
    id: '2',
    label: '全局变量',
    hide: false,
    node: {},
    active: false,
    children: [
      {
        id: '2-1',
        label: '制导系统诸元参数表',
        node: {},
        hide: false,
        active: false,
      },
      {
        id: '2-2',
        label: '姿控系统诸元参数表',
        node: {},
        hide: false,
        active: false,
      },
      {
        id: '2-3',
        label: '姿控系统遥测表',
        node: {},
        hide: false,
        active: false,
      },
      {
        id: '2-4',
        label: '综合飞行软件诸元参数表',
        node: {},
        hide: false,
        active: false,
      },
      {
        id: '2-5',
        label: '综合飞行软件计算机遥测参数表',
        node: {},
        hide: false,
        active: false,
      },
      {
        id: '2-6',
        label: '速度数据',
        node: {},
        hide: false,
        active: false,
      },
    ],
  },
])
const aloneNode = ref({})
const isOut = ref(false)
const tag = ref(true) // 只是为了解决添加节点后不显示父节点下拉箭头
const subGraph = ref({})
const subData = ref({})

// 递归树把节点push到对应树结构中
const interNode = (val, tree) => {
  tree.forEach((node) => {
    if (node.id == aloneNode.value.id) {
      tag.value = false
      nextTick(() => {})
      const nodes = {
        id: val.id,
        children: [],
        label: val.store.data.attrs.text.text,
        node: {},
      }
      if (!node.children) node.children = []
      node.children.push(nodes)
      tag.value = true
    } else if (node?.children) {
      interNode(val, node.children)
    }
  })
}
const interTreeNode = (val, tree) => {
  tree.forEach((node) => {
    if (node.id == aloneNode.value.id) {
      node.node = val
    } else if (node?.children) {
      interTreeNode(val, node.children)
    }
  })
}

function findNode(val, tree) {
  tree.forEach((node) => {
    if (node.id === val.id) {
      handlerTree(node)
    } else if (node?.children) {
      findNode(val, node.children)
    }
  })
}

const handlerTree = (data) => {
  console.log(data)
  if (data.id.length > 1) {
    aloneNode.value = data
    instance.proxy.$bus.emit('showCanvasData', toRaw(data))
    instance.proxy.$bus.emit('addTab', toRaw(data))
  }
}
const hideMenu = (val) => {
  isOut.value = val
  instance.proxy.$bus.emit('resize')
}
function getTask() {
  console.log(work.taskId)
  instance.proxy.$axios.getTaskDetail({ taskId: 2003 }).then((res) => {
    if (res.success) {
      subGraph.value = JSON.parse(res.data.daTree)
      subGraph.value.cells.forEach((item) => {
        if (item.shape === 'image') {
          let split = item.attrs.image['xlink:href'].split('/'),
            url = split[split.length - 1]
          item.attrs.image['xlink:href'] = new URL(`../../../assets/images/${url}`, import.meta.url).href
        }
      })
      instance.proxy.$axios.getTaskDetail({ taskId: 2005 }).then((success) => {
        subData.value = JSON.parse(success.data.daTree)
        subData.value.cells.forEach((item) => {
        if (item.shape === 'image') {
          let split = item.attrs.image['xlink:href'].split('/'),
            url = split[split.length - 1]
          item.attrs.image['xlink:href'] = new URL(`../../../assets/images/${url}`, import.meta.url).href
        }
      })
        // 单独获取左侧菜单的任务列表
        instance.proxy.$axios.getTaskDetail({ taskId: work.taskId.value }).then((result) => {
          console.log(JSON.parse(result.data.daTree))
          if (moduleTree.value[0].id === '1') {
            moduleTree.value.splice(0, 1)
          }
          moduleTree.value.unshift({
            id: '1',
            label: '功能名称',
            hide: false,
            node: {},
            active: false,
            children: JSON.parse(result.data.daTree).cells.filter((item) => {
              return item.shape === 'custom-html'
            }),
          })
          moduleTree.value[0].children.forEach((item) => {
            item.label = item.data.label
            if (item.data.label.indexOf('姿控功能') !== -1) {
              item.node = subGraph.value
              item.children = []
              subGraph.value.cells.forEach((items) => {
                if (items.shape !== 'edge') {
                  items.label = items.attrs.text.text
                  if (items.label === '控制方程') {
                    items.node = subData.value
                    console.log(items)
                  }
                  item.children.push(items)
                }
              })
            }
          })
        })
      })
      // instance.proxy.$axios.getTaskDetail({ taskId: Cookies.get('taskId') }).then((res) => {
      // if (res.data !== null) {
      //   moduleTree.value = JSON.parse(res.data.daTree)
      // }
      // })
    }
  })
}
onMounted(() => {
  getTask()
})
</script>
<style lang="scss" scoped>
.design_menu {
  width: 220px;
  height: 100%;
  background: #fff;
  border-radius: 3px;
  padding: 0;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  position: relative;
  z-index: 10;
  overflow: visible;
  transition: width 0.2s linear;

  h5 {
    font-size: 15px;
    padding: 15px 0;
    border-bottom: 1px solid #e4e8ea;
    text-align: center;
    margin: 0;
  }

  &.fade {
    width: 0;
  }

  &:hover {
    .click {
      opacity: 1;
    }
  }
}

.menu_info {
  height: calc(100% - 60px);
  .custom-tree-node {
    display: flex;
    align-items: center;
    .node_label {
      color: #333;
      font-size: 14px;
    }
    .item_img,
    .sub_img {
      width: 15px;
      height: 15px;
      margin-right: 5px;
    }
  }
}

.el-tree {
  min-width: 100%;
  display: inline-block !important;
  position: relative;
  margin-bottom: 15px;
  /* &::after{
    content: '';
    display: block;
    width: 85%;
    margin: 20px 10px;
    text-align: center;
    border-bottom: 1px solid #acadae;
  } */
}

:deep(.el-tree-node__content) {
  height: 45px;

  .el-tree-node__expand-icon {
    font-size: 16px;
    margin-right: 1px;
  }
}
</style>
