<template>
  <el-aside class="design_menu" :class="{'fade':isOut}">
    <h4 v-if="!isOut">领域算法设计工具</h4>
    <el-scrollbar class="menu_info">
      <el-tree v-if="tag" :data="moduleTree" :expand-on-click-node="false" :indent="12" @node-click="handlerTree"
        class="tree">
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <img v-if="data.children && data.children.length" class="sub_img"
              src="../../../assets/image/wenjianjia.png" />
            <img v-else class="item_img" src="../../../assets/image/wenjian.png" />
            <span class="node_label">{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
    </el-scrollbar>
    <div class="click" @click="out"></div>
  </el-aside>
</template>
<script setup>
import _ from "lodash";
import { onUnmounted } from "vue";

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
      setTimeout(() => {
        localStorage.setItem('fileTree', JSON.stringify(moduleTree.value)) // 保存左侧树文件到本地
      }, 100)
    }
  }
  if (name == 'aloneNode') {
    aloneNode.value = val
  }
})
const moduleTree = ref([
  {
    id: "1",
    label: "任务名称",
    hide: false,
    g6Node: {},
    active: false,
    children: [
      {
        id: "1-1",
        label: "综合任务",
        g6Node: {},
        active: false,
        hide: false,
      },
      {
        id: "1-2",
        label: "姿控任务",
        g6Node: {},
        hide: false,
        active: false,
      },
      {
        id: "1-3",
        label: "制导任务",
        g6Node: {},
        hide: false,
        active: false,
      },
      {
        id: "1-4",
        label: "数据采集任务",
        g6Node: {},
        hide: false,
        active: false,
      },
      {
        id: "1-5",
        label: "遥测任务",
        g6Node: {},
        hide: false,
        active: false,
      },
      {
        id: "1-6",
        label: "遥控任务",
        g6Node: {},
        hide: false,
        active: false,
      },
    ],
  },
  {
    id: "2",
    label: "全局变量",
    hide: false,
    g6Node: {},
    active: false,
    children: [
      {
        id: "2-1",
        label: "制导系统诸元参数表",
        g6Node: {},
        hide: false,
        active: false,
      },
      {
        id: "2-2",
        label: "姿控系统诸元参数表",
        g6Node: {},
        hide: false,
        active: false,
      },
      {
        id: "2-3",
        label: "姿控系统遥测表",
        g6Node: {},
        hide: false,
        active: false,
      },
      {
        id: "2-4",
        label: "综合飞行软件诸元参数表",
        g6Node: {},
        hide: false,
        active: false,
      },
      {
        id: "2-5",
        label: "综合飞行软件计算机遥测参数表",
        g6Node: {},
        hide: false,
        active: false,
      },
      {
        id: "2-6",
        label: "速度数据",
        g6Node: {},
        hide: false,
        active: false,
      },
    ],
  }
])
const aloneNode = ref({})
const tag = ref(true) // 只是为了解决添加节点后不显示父节点下拉箭头
const isOut = ref(false)

// 递归树把节点push到对应树结构中
const interNode = (val, tree) => {
  tree.forEach((node) => {
    if (node.id == aloneNode.value.id) {
      tag.value = false
      nextTick(() => {
        // if (node.children && node.children.length) {
        //   val.id = node.id + "-" + node.children.length
        // } else {
        //   val.id = node.id + "-1"
        // }
      })
      if (!node.children) {
        node.children = []
      }
      node.children.push(val)
      tag.value = true
    } else if (node?.children) {
      interNode(val, node.children);
    }
  })
}
const interTreeNode = (val, tree) => {
  tree.forEach((node) => {
    if (node.id == aloneNode.value.id) {
      node.g6Node = val
    } else if (node?.children) {
      interTreeNode(val, node.children)
    }
  })
}
const handlerTree = (data) => {
  aloneNode.value = data
  instance.proxy.$bus.emit('showCanvasData', toRaw(data))
  instance.proxy.$bus.emit('addTab', toRaw(data))
}
const out = ()=>{
  isOut.value = !isOut.value
  instance.proxy.$bus.emit('resize')
}

onMounted(() => {
  let files = localStorage.getItem('fileTree')
  if (files) {
    moduleTree.value = JSON.parse(files)
  }
})
</script>
<style lang="scss" scoped>
.design_menu {
  width: 240px;
  height: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 0;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  position: relative;
  z-index: 10;
  overflow: visible;
  transition:  width .2s linear;

  h4 {
    padding-bottom: 20px;
    border-bottom: 1px solid #e4e8ea;
    text-align: center;
    margin-bottom: 0;
    white-space: nowrap;
  }

  .click {
    width: 10px;
    height: 20px;
    background-color: #8e9eab;
    border-radius: 0 10px 10px 0;
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    cursor: pointer;

    &:hover {
      background-color: #146ec2;
    }
  }
  &.fade {
    width: 0;
  }
}

.menu_info {
  height: calc(100% - 60px);

  .custom-tree-node {
    display: flex;
    align-items: center;

    .node_label {
      color: #333;
    }

    .item_img,
    .sub_img {
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
  }
}

.el-tree {
  min-width: 100%;
  display: inline-block !important;
}

:deep(.el-tree-node__content) {
  height: 50px;

  .el-tree-node__expand-icon {
    font-size: 16px;
    margin-right: 10px;
  }

  &:hover {
    background-color: #ebf3fe;
  }
}

:deep(.el-tree-node__content) {
  border-radius: 5px;

  &:hover {
    background: linear-gradient(to right, #a8cde8, #d7d2cc);
  }
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background: linear-gradient(to right, #a8cde8, #d7d2cc);
}</style>
