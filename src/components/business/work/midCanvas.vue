<template>
  <!-- 画布区域 -->
  <div class="canvas_box" :class="{ 'out_height': isOut }" ref="targetContent">
    <template v-if="dragList.length">
      <vue-drag-resize v-for="(item, index) in dragList" :key="'i' + item.id" :w="item.w" :h="item.h" :minw="10"
        :minh="40" :x="item.left" :y="item.top" :z="item.z" :parentLimitation="true" :snapToGrid="true" :gridX="1"
        :gridY="1" :parentW="parent.parentW" :parentH="parent.parentH" :style="{ background: item.bgColor }" ref="taskRef"
        class="item" :class="[`task_${item.id}`]" @clicked="(e) => onActivated(e, item, index)"
        @dragstop="(e) => dragstop(e, item)" @resizestop="(e) => resizestop(e, item)">
        {{ item.label }}

        <!-- 虚线 -->
        <div class="dotted_line dotted_line_left" :id="[`dotted${item.id}`]" :style="{ height: item.dottedH + 'px' }">
          <p>{{ item.left - lineOffsetLeft - 100 }}</p>
        </div>
        <div class="dotted_line dotted_line_right" :id="[`dotted${item.id}`]" :style="{ height: item.dottedH + 'px' }">
          <p>{{ parseFloat(item.endTime) }}</p>
        </div>
      </vue-drag-resize>
    </template>

    <!-- 刻度线 -->
    <div ref="line" class="line_info" :style="{
      width: (scaleList.length + 1) * 100 + 'px',
      visibility: showScale ? 'visible' : 'hidden',
    }">
      <div class="scale" v-for="(item, index) in scaleList" :key="item.id"
        :style="{ left: parseFloat(index + 1 + '00') + 'px' }">
        <p>{{ index == 0 ? index : index + "00" }}</p>
      </div>
      <em>t/s</em>
    </div>

    <!-- 飞行段 -->
    <template v-if="flyList.length">
      <vue-drag-resize v-for="(item, index) in flyList" :key="item.title" :w="item.w" :h="40" :minw="10" :minh="40"
        :x="item.left" :y="item.top" :z="20" :parentLimitation="true" :snapToGrid="true" :gridX="1" :gridY="1"
        :parentW="parent.parentW" :parentH="parent.parentH" class="fly"
        :style="{ background: `linear-gradient(135deg, transparent 18px, ${randomRbg(index)} 0)`, }"
        @dragstop="(e) => flyDragStop(e, item)" @resizestop="(e) => flyResizeStop(e, item)"
        @clicked="(e) => flyClicked(e, item, index)">
        {{ item.title }}
      </vue-drag-resize>
    </template>
  </div>

  <el-aside class="el-aside-menu" :class="{ 'fade': slideFade, 'out_height': isOut }">
    <h4 v-if="!slideFade">
      <i class="iconfont icon">&#xe622;</i>
      应用任务模型
    </h4>
    <el-scrollbar class="scrollbar">
      <el-menu class="menu-info">
        <modelMenu :moduleTree="moduleTree"></modelMenu>
      </el-menu>
    </el-scrollbar>
    <div class="handle" @click="fade"></div>
  </el-aside>
</template>
<script setup>
import vueDragResize from 'vue-drag-resize/src'
import modelMenu from './modelMenu.vue'
import { randomRbg } from "@/utils/utils";
import _ from "lodash";
import { workStore } from '@/store/index'
import { storeToRefs } from 'pinia';

const instance = getCurrentInstance()
instance.proxy.$bus.on('*', (name, val) => {
  if (name == 'setFlyData') {
    banResize.value = true
    showScale.value = true
    const copy = _.cloneDeep(val)
    const lineEl = line.value
    nextTick(() => {
      if (copy.action == 'add') {
        copy.form.top = lineEl.offsetTop - 80
        flyList.value.push(copy.form)
      } else if (copy.action == 'update') {
        flyList.value.forEach((vals) => {
          if (vals.title == copy.form.oldTitle) {
            nextTick(() => {
              vals.left = copy.form.left
              nextTick(() => {
                vals.w = copy.form.w
              })
            })
            vals.sTime = copy.form.sTime
            vals.eTime = copy.form.eTime
            vals.title = copy.form.title
            vals.top = (lineEl.offsetTop - 80)
            vals.oldTitle = copy.form.oldTitle
          }
        })
      } else if (copy.action == 'remove') {
        flyList.value.forEach((d, i) => {
          if (d.title == copy.form.oldTitle) {
            flyList.value.splice(i, 1)
          }
        })
      }
      save()
    })
  }
  if (name == 'sendOut') {
    isOut.value = val
    parentSize()
  }
})

const work = workStore()
const { taskPropertyData, dragEv } = storeToRefs(work)
const moduleTree = ref([
  {
    id: "1",
    label: "业务模型库",
    isDrag: false,
    hide: false,
    children: [
      {
        id: "1-1",
        label: "综合控制任务",
        isDrag: true,
        bgColor: "#f8ebdc",
        control: false,
      },
      {
        id: "1-2",
        label: "遥测任务",
        isDrag: true,
        bgColor: "#e8f6dc",
        control: false,
      },
      {
        id: "1-3",
        label: "遥控任务",
        isDrag: true,
        bgColor: "#e0f4f5",
        control: false,
      },
      {
        id: "1-4",
        label: "数据采集任务",
        isDrag: true,
        bgColor: "#fff",
        control: false,
      },
      {
        id: "1-5",
        label: "姿控任务",
        isDrag: true,
        bgColor: "#f5deec",
        control: false,
      },
      {
        id: "1-6",
        label: "制导任务",
        isDrag: true,
        bgColor: "#e8ebed",
        control: false,
      },
    ],
  },
  {
    id: "2",
    label: "基础模型库",
    isDrag: false,
    hide: false,
    children: [
      {
        id: "2-1",
        label: "通用任务",
        isDrag: true,
      },
    ],
  },
])
const dragItem = ref(null) // 当前拖动元素信息
const dragList = ref([]) // 拖动元素列表
const scaleList = ref([])
const idList = ref([])
const showScale = ref(false)
const lineOffsetLeft = ref(null)
const banResize = ref(false)
const flyList = ref([]) // 飞行段列表
const targetContent = ref(null)
const line = ref(null)

const slideFade = ref(false)
const isOut = ref(false)
const parent = reactive({
  parentW: 0,
  parentH: 0
})

watchEffect(() => {
  if (dragList.value.length) {
    showScale.value = true
    banResize.value = true
    nextTick(() => {
      lineOffsetLeft.value = line.value.offsetLeft
      dragList.value.forEach((item) => {
        const dottedEl = document.getElementsByClassName(`task_${item.id}`)[0]
        const h = line.value.offsetTop - dottedEl.offsetTop
        item.dottedH = h
        item.endTime = item.w + (item.left - lineOffsetLeft.value - 100) + "s"
      })
      banResize.value = false
      save()
    })
  }
})
watch([taskPropertyData, dragEv], ([t, drag], [ot]) => {
  if (drag !== null) {
    dragstart(drag)
  }
  if (JSON.stringify(t) !== JSON.stringify(ot)) {
    banResize.value = true
    dragList.value.forEach((item) => {
      if (item.label == t.label) {
        nextTick(() => {
          item.left = t.left
          nextTick(() => {
            item.w = t.w
          })
        })
        item.desc = t.desc
        item.endTime = t.endTime
        item.langTime = t.langTime
        item.prec = t.prec
        item.startTime = t.startTime
        item.needList = t.needList
      }
    })
    console.log(dragList.value);
    setTimeout(() => {
      save()
    }, 100)
  }
  setTimeout(() => {
    banResize.value = false
  }, 2000)
}, { deep: true })
// 拖拽元素开始
const dragstart = (item) => {
  dragItem.value = item;
  // 元素行为 移动
  targetContent.value.addEventListener("dragenter", dragenter);
  // 目标元素经过 禁止默认事件
  targetContent.value.addEventListener("dragover", dragover);
  // 离开目标元素设置元素的放置行为  不能拖放
  targetContent.value.addEventListener("dragleave", dragleave);
  // 拖动元素在目标元素松手时添加元素到画布
  targetContent.value.addEventListener("drop", drop);
}
const dragenter = (e) => {
  e.dataTransfer.dropEffect = "move"
}
const dragover = (e) => {
  e.preventDefault()
}
const dragleave = (e) => {
  e.dataTransfer.dropEffect = "none"
}
const drop = (e) => {
  if (idList.value.indexOf(dragItem.value.id) !== -1) {
    dragItem.value = null;
    return;
  }
  dragItem.value.top = e.layerY;
  dragItem.value.left = e.layerX;
  dragItem.value.w = 100; // 初始宽
  dragItem.value.h = 40; // 初始高
  dragItem.value.z = 'auto'
  idList.value.push(dragItem.value.id);
  dragList.value.push(dragItem.value);
  dragItem.value = null;
  targetContent.value.removeEventListener("dragenter", dragenter);
  targetContent.value.removeEventListener("dragover", dragover);
  targetContent.value.removeEventListener("dragleave", dragleave);
  targetContent.value.removeEventListener("drop", drop);
  save()
}
const onActivated = (e, item, index) => {
  dragList.value.forEach(drag => {
    if (item.id === drag.id) {
      drag.z = 2001
    } else {
      drag.z = 'auto'
    }
  })
  document.onkeydown = (e) => {
    if (e.keyCode === 8) {
      // 删除自身
      dragList.value.splice(index, 1)
      save()
      // 删除id，以便下次继续拖进
      idList.value.map((d, i) => {
        if (d == item.id) {
          idList.value.splice(i, 1)
        }
      });
      // 属性表格置空
      work.setShowTable({ status: true, label: item.label, data: {} })
    }
  };
  document.onkeyup = () => {
    document.onkeydown = null;
    document.onkeyup = null;
  };
}
const dragstop = (e, item) => {
  updateSize(e, item);
}
// 画布内元素尺寸发生变化
const resizestop = (e, item) => {
  updateSize(e, item);
  // const lineEl = line.value,
  //   lineElw = lineEl.style.width.split("px")[0],
  //   parentEl = targetContent.value;
  // if (e.width > lineElw) {
  //   if (Number(parentEl.offsetWidth) - Number(lineElw) <= 300) {
  //     return;
  //   }
  //   let number = (e.width / 100).toFixed(0),
  //     fromNum = scaleList.value.length,
  //     gapNum = number - scaleList.value.length;
  //   for (var i = 0; i < gapNum; i++) {
  //     scaleList.value.push({
  //       id: fromNum + (i + 1),
  //     });
  //   }
  //   lineEl.style.width = e.width + "px";
  // }
}
const updateSize = (e, item) => {
  if (banResize.value) {
    return
  }
  console.log("模型组件更新触发", e);
  // 获取虚线元素
  const dottedEl = document.getElementById(`dotted${item.id}`)
  // 虚线父级元素
  const par = document.getElementsByClassName(`task_${item.id}`)[0]
  // 获取刻度线元素
  const scaleLineEl = line.value
  const dottedTop = dottedEl.offsetTop + par.offsetTop,
    scaleTop = scaleLineEl.offsetTop,
    h = scaleTop - dottedTop;
  dragList.value.forEach((v) => {
    if (v.id == item.id) {
      v.left = e.left
      v.top = e.top
      v.dottedH = h
      v.w = e.width
      v.endTime = e.width + (item.left - scaleLineEl.offsetLeft - 100) + "s"
      v.startTime = item.left - scaleLineEl.offsetLeft - 100 + "s"
      // v.langTime = ""
      // v.desc = ""
      // v.prec = ""
      v.lineOffsetLeft = scaleLineEl.offsetLeft
      lineOffsetLeft.value = scaleLineEl.offsetLeft
    }
  });
  work.setShowTable({
    status: true,
    label: item.label,
    data: {
      ...item,
    },
  })
  work.setScaleLineData(line.value)
  save()
}
const flyDragStop = (e, item) => {
  flyUpdate(e, item, "drag");
}
const flyResizeStop = (e, item) => {
  flyUpdate(e, item, "resize");
}
const flyUpdate = (e, item, type) => {
  if (banResize.value) return
  const lineElLeft = line.value.offsetLeft
  flyList.value.forEach((d) => {
    if (d.title == item.title) {
      if (type == "drag") {
        d.sTime = e.left - lineElLeft - 100 + "s";
        d.eTime = e.width + parseFloat(item.sTime) + "s";
      }
      if (type == "resize") {
        // 如果元素left变动需要重新计算
        if (e.left !== item.left) {
          d.sTime = e.left - lineElLeft - 100 + "s";
          d.eTime = e.width + (e.left - lineElLeft - 100) + "s";
        } else {
          // 如果元素left未变动只需要计算元素右边
          d.eTime = e.width + (item.left - lineElLeft - 100) + "s";
        }
      }
      d.w = e.width
      d.left = e.left
      d.top = e.top
    }
  })
  work.setTableFlyData(flyList.value)
  save()
}
const flyClicked = (e, item, index) => {
  document.onkeydown = (e) => {
    // 删除元素
    if (e.keyCode === 8) {
      flyList.value.splice(index, 1);
      save()
    }
  };
  document.onkeyup = () => {
    document.onkeydown = null;
    document.onkeyup = null;
  };
}
// 保存数据到本地
const save = () => {
  localStorage.setItem('workData', JSON.stringify({
    dragData: dragList.value,
    flyData: flyList.value
  }))
  instance.proxy.$bus.emit('sendMessage', dragList.value)
}
const fade = () => {
  slideFade.value = !slideFade.value
  parentSize()
}

// 重新计算画布宽高，限制元素边界
function parentSize() {
  setTimeout(() => {
    parent.parentW = targetContent.value.clientWidth
    parent.parentH = targetContent.value.clientHeight
  }, 300)
}

onMounted(() => {
  work.setScaleLineData(line.value)
  const length = Math.floor(targetContent.value.offsetWidth / 100)
  let count = 0
  for (var i = 0; i < length - 2; i++) {
    scaleList.value.push({
      num: count += 100
    })
  }
  let workData = localStorage.getItem('workData')
  if (workData) {
    dragList.value = JSON.parse(workData).dragData
    dragList.value.forEach(drag => {
      idList.value.push(drag.id)
    })
    flyList.value = JSON.parse(workData).flyData
  }

  instance.proxy.$bus.emit('sendMessage', dragList.value)
})
</script>
<style lang="scss" scoped>
.canvas_box {
  flex: 1;
  height: calc(100% - 236px);
  background: #fff;
  border-radius: 10px;
  margin-right: 20px;
  position: relative;
  background-image: linear-gradient(90deg, rgba(60, 10, 30, 0.07) 3%, transparent 0), linear-gradient(1turn, rgba(60, 10, 30, 0.07) 3%, transparent 0);
  background-size: 20px 20px;
  background-position: 50%;
  background-repeat: repeat;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  overflow: hidden;
  transition: height .2s ease-in-out;

  &.out_height {
    height: 100%;
  }

  .item {
    border: 1px solid #333;
    cursor: move;

    :deep(.content-container) {
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .line_info {
    width: 500px;
    height: 2px;
    background: #333;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 66px;
    margin: 0 auto;

    &::before {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      right: -19px;
      width: 0;
      height: 0;
      border: 10px solid;
      margin-top: -10px;
      border-color: transparent transparent transparent #333;
    }

    em {
      position: absolute;
      right: -15px;
      top: 12px;
    }

    .scale {
      height: 40px;
      width: 2px;
      background: #333;
      position: absolute;
      top: -20px;

      p {
        font-size: 14px;
        position: absolute;
        bottom: -32px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  .dotted_line {
    border-right: 1px dashed #000;
    height: 400px;
    position: absolute;
    top: -30px;

    p {
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .dotted_line_left {
    left: -1px;
  }

  .dotted_line_right {
    right: -1px;
  }

  .fly {
    font-size: 15px;
    position: absolute;
    background: linear-gradient(135deg, transparent 18px, red 0);
    cursor: move;

    :deep(.content-container) {
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.el-aside-menu {
  height: calc(100% - 236px);
  max-width: 200px;
  margin-bottom: 0;
  padding: 0;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  position: relative;
  overflow: visible;
  transition: width .3s ease-in-out, height .2s ease-in-out;

  h4 {
    padding-bottom: 20px;
    border-bottom: 1px solid #e4e8ea;
    text-align: center;
    margin-bottom: 0;
    white-space: nowrap;

    .icon {
      margin-right: 8px;
    }
  }

  .icons {
    display: inline-block;
    width: 100%;
    text-align: center;
  }

  .scrollbar {
    height: calc(100% - 60px);
  }

  .handle {
    width: 12px;
    height: 20px;
    background-color: #8e9eab;
    border-radius: 10px 0 0 10px;
    position: absolute;
    top: 50%;
    left: -12px;
    transition: all .2s linear;
    cursor: pointer;

    &:hover {
      background-color: #146ec2;
    }
  }

  &.fade {
    width: 0;
  }

  &.out_height {
    height: 100%;
  }
}

.menu-info {
  width: 100%;
  display: inline-block;
  border-right: none;
}
</style>
