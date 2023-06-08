<template>
  <el-aside class="aside" :class="{'fade':isOut}">
    <h4 v-if="!isOut">领域化架构设计工具</h4>
    <ul :class="{'op':isOut}">
      <li v-for="(item, index) in stepList" :key="index" :class="{ 'disabled': item.disabled, 'hover': activeIdx == index }"
        @click="stepHandler(item, index, $event)">
        <!-- <i class="iconfont icon">&#xe630;</i> -->
        <img class="item_img" src="../../../assets/image/liebiao.png" />
        {{ item.label }}
      </li>
    </ul>
    <markPoint :isOut="isOut" :direction="'right'" :color="'#fff'" @hideMenu="hideMenu"></markPoint>
  </el-aside>
</template>
<script setup>
import markPoint from '../../common/mark/markPoiner.vue'

const emit = defineEmits(['checkTab'])
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
    label: "步骤一：任务定义",
    disabled: false
  },
  {
    id: 2,
    label: "步骤二：全局数据定义",
    disabled: false
  },
  {
    id: 3,
    label: "步骤三：任务关系定义",
    disabled: false
  },
])
const activeIdx = ref(0)
const isOut = ref(false)
const stepHandler = (item, index, event) => {
  if (item.disabled) {
    event.preventDefault()
    return
  }
  activeIdx.value = index
  emit('checkTab', index)
}
const hideMenu = (val)=>{
  isOut.value = val
  instance.proxy.$bus.emit('hideMenu',val)
}
</script>
<style lang="scss" scoped>
.aside {
  width: 240px;
  height: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  padding: 0;
  position: relative;
  overflow: visible;
  transition: width .2s linear;
  &.fade{
    width: 0;
  }
  &:hover {
    .click {
      opacity: 1;
    }
  }
}

h4 {
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e8ea;
  text-align: center;
  margin-bottom: 0;
}

ul {
  padding: 0 10px;
  transition: opacity .2s linear;

  li {
    height: 40px;
    font-size: 15px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    border-radius: 10px;
    font-weight: 500;
    margin: 4px 0;
    cursor: pointer;
    white-space: nowrap;

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
  &.op{
    opacity: 0;
  }
}</style>
