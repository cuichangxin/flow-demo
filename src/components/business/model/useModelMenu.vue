<script setup>
import ModelMenu from './modelMenu.vue'
import markPoint from '../../common/mark/markPoiner.vue'

const instance = getCurrentInstance()
instance.proxy.$bus.on('*', (name, val) => {
  if (name === 'contraction') {
    isOut.value = val
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
            img: new URL('../../../assets/image/jia.png', import.meta.url).href,
          },
          {
            id: '1-1-2',
            label: '减',
            hide: false,
            active: false,
            children: [],
            shape: 'image',
            img: new URL('../../../assets/image/jian.png', import.meta.url).href,
          },
          {
            id: '1-1-3',
            label: '乘',
            hide: false,
            active: false,
            children: [],
            shape: 'image',
            img: new URL('../../../assets/image/cheng.png', import.meta.url).href,
          },
          {
            id: '1-1-4',
            label: '除',
            hide: false,
            active: false,
            children: [],
            shape: 'image',
            img: new URL('../../../assets/image/chu.png', import.meta.url).href,
          },
          {
            id: '1-1-5',
            label: '模',
            hide: false,
            active: false,
            children: [],
            shape: 'image',
            img: new URL('../../../assets/image/mo.png', import.meta.url).href,
          },
          {
            id: '1-1-6',
            label: '强转',
            hide: false,
            active: false,
            children: [],
            shape: 'image',
            img: new URL('../../../assets/image/qiangzhuan.png', import.meta.url).href,
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
  <el-aside class="model_menu" :class="{ fade: isOut }">
    <h4 v-if="!isOut">
      <i class="iconfont icon">&#xe622;</i>
      应用任务模型
    </h4>
    <el-scrollbar class="menu_info">
      <el-menu id="menu" :default-openeds="['2']">
        <ModelMenu :menus="moduleTree" :drag="true"></ModelMenu>
      </el-menu>
    </el-scrollbar>
    <markPoint :isOut="isOut" :direction="'left'" :color="'#fff'" @hideMenu="hideMenu"></markPoint>
  </el-aside>
</template>

<style lang="scss" scoped>
.model_menu {
  margin-left: 10px;
  padding: 0;
  width: 240px;
  height: 100%;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: visible;
  transition: width 0.2s linear;

  h4 {
    margin: 0;
    padding: 15px 0;
    border-bottom: 1px solid #e4e8ea;
    text-align: center;
  }
  .icons {
    display: flex;
    justify-content: center;
  }

  .menu_info {
    height: calc(100% - 60px);
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

:deep(.el-menu) {
  border-right: none;
}
</style>
