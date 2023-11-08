<script setup>
import ModelMenu from './modelMenu.vue'
import markPoint from '../../common/mark/markPoiner.vue'

const instance = getCurrentInstance()
instance.proxy.$bus.on('*', (name, val) => {
  if (name === 'contraction') {
    isOut.value = val
  }
  if (name === 'saveAlg') {
    console.log(val)
    moduleTree.value.forEach((item) => {
      if (item.label === '领域算法库') {
        item.children.push({
          id: '3-' + item.children.length + 1,
          label: '3选1',
          hide: false,
          active: false,
          children: [],
        })
      }
    })
  }
})

const moduleTree = ref([
  {
    id: '1',
    label: '基础操作符',
    hide: false,
    active: false,
    children: [
      {
        id: '1-1',
        label: '数学运算',
        hide: false,
        active: false,
        children: [
          {
            id: '1-1-1',
            label: '加',
            hide: false,
            active: false,
            children: [],
            shape: 'image',
            img: new URL('../../../assets/images/jia.png', import.meta.url).href,
          },
          {
            id: '1-1-2',
            label: '减',
            hide: false,
            active: false,
            children: [],
            shape: 'image',
            img: new URL('../../../assets/images/jian.png', import.meta.url).href,
          },
          {
            id: '1-1-3',
            label: '乘',
            hide: false,
            active: false,
            children: [],
            shape: 'image',
            img: new URL('../../../assets/images/cheng.png', import.meta.url).href,
          },
          {
            id: '1-1-4',
            label: '除',
            hide: false,
            active: false,
            children: [],
            shape: 'image',
            img: new URL('../../../assets/images/chu.png', import.meta.url).href,
          },
          {
            id: '1-1-5',
            label: '模',
            hide: false,
            active: false,
            children: [],
            shape: 'image',
            img: new URL('../../../assets/images/mo.png', import.meta.url).href,
          },
          {
            id: '1-1-6',
            label: '强转',
            hide: false,
            active: false,
            children: [],
            shape: 'image',
            img: new URL('../../../assets/images/qiangzhuan.png', import.meta.url).href,
          },
        ],
      },
      {
        id: '1-2',
        label: '比较运算',
        hide: false,
        active: false,
        children: [
          {
            id: '1-2-1',
            label: '< 小于',
            hide: false,
            active: false,
            fill: '#3eede7',
            shape: 'custom-rect',
            children: [],
          },
          {
            id: '1-2-2',
            label: '≤ 小于等于',
            hide: false,
            active: false,
            fill: '#ffa400',
            shape: 'custom-circle',
            children: [],
          },
          {
            id: '1-2-3',
            label: '> 大于',
            hide: false,
            active: false,
            fill: '#725e82',
            shape: 'custom-ellipse',
            children: [],
          },
          {
            id: '1-2-4',
            label: '≥ 大于等于',
            hide: false,
            active: false,
            shape: 'custom-polygon-rhombus',
            children: [],
          },
          {
            id: '1-2-5',
            label: '≠ 不等于',
            hide: false,
            active: false,
            shape: 'custom-polygon-quad',
            children: [],
          },
          {
            id: '1-2-6',
            label: '= 等于',
            hide: false,
            active: false,
            children: [],
          },
        ],
      },
      {
        id: '1-3',
        label: '逻辑运算',
        hide: false,
        active: false,
        children: [
          {
            id: '1-3-1',
            label: '与',
            hide: false,
            active: false,
            children: [],
          },
          {
            id: '1-3-2',
            label: '或',
            hide: false,
            active: false,
            children: [],
          },
          {
            id: '1-3-3',
            label: '非',
            hide: false,
            active: false,
            children: [],
          },
          {
            id: '1-3-4',
            label: '异或',
            hide: false,
            active: false,
            children: [],
          },
        ],
      },
      {
        id: '1-4',
        label: '时序运算',
        hide: false,
        active: false,
        children: [
          {
            id: '1-4-1',
            label: '初始化',
            hide: false,
            active: false,
            fill: '#1bd1a5',
            children: [],
          },
          {
            id: '1-4-2',
            label: '当...时',
            hide: false,
            active: false,
            children: [],
          },
          {
            id: '1-4-3',
            label: '被...跟随',
            hide: false,
            active: false,
            fill: '#549688',
            children: [],
          },
          {
            id: '1-4-4',
            label: '定时',
            hide: false,
            active: false,
            children: [],
          },
        ],
      },
      {
        id: '1-5',
        label: '选择运算',
        hide: false,
        active: false,
        children: [
          {
            id: '1-5-1',
            label: 'If...Then...Else...',
            hide: false,
            active: false,
            children: [],
          },
          {
            id: '1-5-2',
            label: 'Case',
            hide: false,
            active: false,
            children: [],
          },
        ],
      },
      {
        id: '1-6',
        label: '位运算',
        hide: false,
        active: false,
        children: [
          {
            id: '1-6-1',
            label: '位与',
            hide: false,
            active: false,
            children: [],
          },
          {
            id: '1-6-2',
            label: '位或',
            hide: false,
            active: false,
            children: [],
          },
          {
            id: '1-6-3',
            label: '位取反',
            hide: false,
            active: false,
            children: [],
          },
          {
            id: '1-6-4',
            label: '位异或',
            hide: false,
            active: false,
            children: [],
          },
          {
            id: '1-7-5',
            label: '逻辑左移',
            hide: false,
            active: false,
            children: [],
          },
          {
            id: '1-8-6',
            label: '逻辑右移',
            hide: false,
            active: false,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    label: '基础算法库',
    hide: false,
    active: false,
    children: [
      {
        id: '2-1',
        label: '矩阵运算',
        hide: false,
        active: false,
        children: [
          {
            id: '2-1-1',
            label: '反转',
            hide: false,
            active: false,
            children: [],
          },
        ],
      },
      {
        id: '2-2',
        label: '矢量运算',
        hide: false,
        active: false,
        children: [],
      },
      {
        id: '2-3',
        label: '方向余弦',
        hide: false,
        active: false,
        children: [],
      },
      {
        id: '2-4',
        label: '四元数运算',
        hide: false,
        active: false,
        children: [],
      },
      {
        id: '2-5',
        label: '数据处理',
        hide: false,
        active: false,
        children: [],
      },
      {
        id: '2-6',
        label: '队列初始化',
        hide: false,
        active: false,
        children: [],
      },
      {
        id: '2-7',
        label: '线性插值',
        hide: false,
        active: false,
        children: [],
      },
      {
        id: '2-8',
        label: '出队运算',
        hide: false,
        active: false,
        children: [],
      },
      {
        id: '2-9',
        label: '入队运算',
        hide: false,
        active: false,
        children: [],
      },
    ],
  },
  {
    id: '3',
    label: '领域算法库',
    hide: false,
    active: false,
    children: [
      {
        id: '3-1',
        label: '姿态确定',
        hide: false,
        active: false,
        children: [],
      },
      {
        id: '3-2',
        label: '姿态控制',
        hide: false,
        active: false,
        children: [],
      },
      {
        id: '3-3',
        label: '空间环境',
        hide: false,
        active: false,
        children: [],
      },
      {
        id: '3-4',
        label: '故障诊断',
        hide: false,
        active: false,
        children: [],
      },
      {
        id: '3-5',
        label: '3选2',
        hide: false,
        active: false,
        children: [],
      },
    ],
  },
])
const isOut = ref(false)

const hideMenu = (val) => {
  isOut.value = val
  instance.proxy.$bus.emit('resize')
}
</script>
<template>
  <div class="wrapper_box" :class="{ fade: isOut }">
    <div class="model_wrapper">
      <el-aside class="model_menu">
        <h5 v-if="!isOut">应用任务模型</h5>
        <el-menu id="menu" :default-openeds="['2']">
          <ModelMenu :menus="moduleTree" :drag="true"></ModelMenu>
        </el-menu>
      </el-aside>
    </div>
    <markPoint :isOut="isOut" :direction="'left'" :color="'#fff'" @hideMenu="hideMenu"></markPoint>
  </div>
</template>

<style lang="scss" scoped>
.model_menu {
  padding: 0;
  width: 100%;
  height: 100%;
  background: var(--my-bg-color);

  h5 {
    font-size: 15px;
    padding: 15px 0;
    border-bottom: 1px solid var(--el-border-color);
    border-top: 1px solid var(--el-border-color);
    text-align: center;
    margin: 0;
    color: var(--my-text-bg-color-3);
  }
  .icons {
    display: flex;
    justify-content: center;
  }
}

:deep(.el-menu) {
  border-right: none;
}
.model_wrapper {
  height: 100%;
}
.wrapper_box {
  width: 200px;
  background-color: var(--my-bg-color);
  margin-left: 10px;
  position: relative;
  transition: width 0.2s linear;
  &.fade {
    width: 0;
  }
  &:hover {
    .click {
      opacity: 1;
    }
  }
}
</style>
