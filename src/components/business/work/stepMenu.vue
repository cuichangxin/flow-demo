<template>
  <el-aside class="aside" :class="{ fade: isOut }">
    <h5 v-if="!isOut">领域化架构设计工具</h5>
    <ul class="step-box" :class="{ op: isOut }">
      <li
        v-for="(item, index) in stepList"
        :key="index"
        :class="{ disabled: item.disabled, hover: activeIdx == index }"
        :title="item.tooltip"
        @click="stepHandler(item, index, $event)"
      >
        {{ item.label }}
      </li>
    </ul>
    <markPoint :isOut="isOut" :direction="'right'" :color="'#fff'" @hideMenu="hideMenu"></markPoint>
  </el-aside>
</template>
<script setup>
import markPoint from '../../common/mark/markPoiner.vue'

const props = defineProps({
  tabIdx: {
    type: Number,
  },
})
const emit = defineEmits(['checkTab', 'openAI'])
const instance = getCurrentInstance()
instance.proxy.$bus.on('sendMessage', (val) => {
  if (val.length <= 0) {
    stepList.value[2].disabled = true
  } else {
    stepList.value[2].disabled = false
  }
})
const stepList = ref([
  {
    id: 1,
    label: '步骤一：任务定义',
    disabled: false,
    tooltip: '智能建议',
  },
  {
    id: 2,
    label: '步骤二：全局数据定义',
    disabled: false,
  },
  {
    id: 3,
    label: '步骤三：任务关系定义',
    disabled: true,
  },
])
const activeIdx = ref(0)
const isOut = ref(false)
const scrollbarHeight = ref(0)

const stepHandler = (item, index, event) => {
  if (item.disabled) {
    event.preventDefault()
    return
  }
  activeIdx.value = index
  emit('checkTab', index)
}
const hideMenu = (val) => {
  isOut.value = val
  instance.proxy.$bus.emit('hideMenu', val)
}
const handleToolMenu = (target, val) => {
  if (val === '格式') {
    hideMenu(target)
  }
}
defineExpose({ handleToolMenu })
onMounted(() => {
  scrollbarHeight.value = window.innerHeight - 460
  window.addEventListener('resize', () => {
    scrollbarHeight.value = window.innerHeight - 460
  })
})
</script>
<style lang="scss" scoped>
.aside {
  width: 210px;
  height: 100%;
  background: #fff;
  border-radius: 3px;
  padding: 0;
  position: relative;
  overflow: visible;
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
.step-box {
  padding-bottom: 20px;
  margin: 0 10px;
}

h5 {
  font-size: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #e4e8ea;
  text-align: center;
  margin: 0;
  box-shadow: 0 0 16px -5px rgba(0, 0, 0, 0.2);
}
.sub-title {
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  margin: 15px 0 0 10px;
  color: #3d3b4f;
}

ul {
  padding: 8px 0 0;
  transition: opacity 0.2s linear;

  li {
    height: 40px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 20px;
    border-radius: 3px;
    font-weight: 500;
    margin: 1px 0;
    cursor: pointer;
    white-space: nowrap;
    color: #626262;

    &:hover {
      background-color: #3a75f9;
      color: #fff;
    }

    .item_img {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }

    &.disabled {
      cursor: not-allowed;
      background: #dfdcdc;
      color: #333;
      opacity: 0.5;
    }

    &.hover {
      background-color: #3a75f9;
      color: #fff;
    }
  }
  &.op {
    opacity: 0;
  }
}
.el-menu {
  width: 100%;
  border-right: none;
}
:deep(.menu-info) {
  width: 100%;
  display: inline-block;
  .el-sub-menu__title,
  .el-menu-item {
    height: 50px;
    font-weight: 500;
    font-size: 13px;
    color: #626262;
  }
}
.icon-jiqiren_o {
  font-size: 20px;
  font-weight: 600;
  margin-right: 4px;
  &:hover {
    color: #a1afc9;
  }
}
</style>
