<template>
  <div class="flow-editor-collapse" ref="collapseRef" :style="{ right: isCollapse ? '-220px' : '' }">
    <div class="flow-editor-collapse-wrapper">
      <div class="flow-json-schema-form-body">
        <div class="tabs">设置</div>
        <div class="flow-center-box">
          <el-scrollbar>
            <el-form v-if="isSelect" :model="flowForm" class="flow-editor-form">
              <div class="type-title">内容</div>
              <el-form-item class="form-item border" label="标题" prop>
                <el-input size="small" v-model="flowForm.label" @input="changeConfig"></el-input>
              </el-form-item>
              <div class="type-title">样式</div>
              <div v-if="isShape">
                <el-form-item class="form-item location" label="位置">
                  <el-input-number
                    size="small"
                    style="width: 70px"
                    controls-position="right"
                    v-model="flowForm.x"
                    @change="changeConfig"
                  ></el-input-number>
                  <span>x</span>
                  <el-input-number
                    size="small"
                    style="width: 70px"
                    controls-position="right"
                    v-model="flowForm.y"
                    @change="changeConfig"
                  ></el-input-number>
                  <span>y</span>
                </el-form-item>
                <el-form-item class="form-item location" label="尺寸">
                  <el-input-number
                    size="small"
                    style="width: 70px"
                    controls-position="right"
                    v-model="flowForm.width"
                    @change="changeConfig"
                  ></el-input-number>
                  <span>w</span>
                  <el-input-number
                    size="small"
                    style="width: 70px"
                    controls-position="right"
                    v-model="flowForm.height"
                    @change="changeConfig"
                  ></el-input-number>
                  <span>h</span>
                </el-form-item>
                <el-form-item class="form-item" label="填充">
                  <el-color-picker
                    v-model="flowForm.fill"
                    show-alpha
                    size="small"
                    :predefine="predefineColors"
                    @change="changeConfig"
                  />
                </el-form-item>
                <el-form-item class="form-item" label="边框">
                  <el-color-picker
                    v-model="flowForm.stroke"
                    show-alpha
                    size="small"
                    :predefine="predefineColors"
                    @change="changeConfig"
                  />
                  <el-input-number
                    size="small"
                    style="width: 100px; margin-left: 5px"
                    controls-position="right"
                    v-model="flowForm.nodeStrokeWidth"
                    @change="changeConfig"
                  ></el-input-number>
                </el-form-item>
                <el-form-item class="form-item location flex-start" label="字号">
                  <el-input-number
                    size="small"
                    style="width: 100px; margin-right: 5px"
                    controls-position="right"
                    v-model="flowForm.fontsize"
                    @change="changeConfig"
                  ></el-input-number>
                  <el-color-picker
                    v-model="flowForm.color"
                    show-alpha
                    size="small"
                    :predefine="predefineColors"
                    @change="changeConfig"
                  />
                </el-form-item>
                <el-form-item class="form-item location flex-start" label="圆角">
                  <el-input-number
                    size="small"
                    style="width: 100px"
                    controls-position="right"
                    v-model="flowForm.radio"
                    @change="changeConfig"
                  ></el-input-number>
                </el-form-item>
                <el-form-item class="form-item location flex-start" label="阴影">
                  <el-checkbox v-model="flowForm.shadow" @change="changeConfig" />
                </el-form-item>
              </div>
              <div v-else>
                <div class="type-title">线</div>
                <el-form-item class="form-item location" label="箭头">
                  <el-select v-model="flowForm.arrowType" size="small" @change="changeConfig">
                    <el-option v-for="item in arrowTypeList" :key="item.type" :label="item.name" :value="item.type" />
                  </el-select>
                </el-form-item>
                <el-form-item class="form-item location" label="方向">
                  <el-select v-model="flowForm.direction" size="small" @change="changeConfig">
                    <el-option v-for="item in directionList" :key="item.type" :label="item.name" :value="item.type" />
                  </el-select>
                </el-form-item>
                <el-form-item class="form-item location flex-center" label="线形">
                  <el-select
                    v-model="flowForm.lineShape"
                    size="small"
                    style="width: 70px; margin: 0 6px 6px 0"
                    @change="changeConfig"
                  >
                    <el-option v-for="item in lineShapeList" :key="item.type" :label="item.name" :value="item.type" />
                  </el-select>
                  <el-color-picker
                    v-model="flowForm.lineColor"
                    show-alpha
                    size="small"
                    style="margin: 0 6px 6px 0"
                    :predefine="predefineColors"
                    @change="changeConfig"
                  />
                  <el-input-number
                    size="small"
                    style="width: 70px; margin-right: 6px;"
                    controls-position="right"
                    v-model="flowForm.lineSize"
                    @change="changeConfig"
                  ></el-input-number>
                  <el-select v-model="flowForm.lineStyle" size="small" style="width: 80px" @change="changeConfig">
                    <el-option v-for="item in lineStyleList" :key="item.type" :label="item.name" :value="item.type" />
                  </el-select>
                </el-form-item>
                <div class="type-title">标签</div>
                <el-form-item class="form-item location flex-start" label="字号">
                  <el-input-number
                    size="small"
                    style="width: 100px; margin-right: 5px"
                    controls-position="right"
                    v-model="flowForm.lineFontsize"
                    @change="changeConfig"
                  ></el-input-number>
                  <el-color-picker
                    v-model="flowForm.lineTextColor"
                    show-alpha
                    size="small"
                    :predefine="predefineColors"
                    @change="changeConfig"
                  />
                </el-form-item>
              </div>
            </el-form>
            <div v-else class="not-select">未选中</div>
          </el-scrollbar>
        </div>
      </div>
      <div class="flow-json-schema-form-footer"></div>
      <div
        class="flow-editor-icon"
        :style="{
          borderRadius: isCollapse ? '50% 0px 0px 50%' : '',
          left: isCollapse ? '-19px' : '',
        }"
        @click="collapse"
      >
        <el-icon :style="{ transform: isCollapse ? 'rotate(180deg)' : '' }"><DArrowRight /></el-icon>
      </div>
    </div>
  </div>
</template>
<script setup>
import { DArrowRight } from '@element-plus/icons-vue'

const emit = defineEmits(['changeNode'])
const props = defineProps({
  nodeConfig: {
    type: Object,
    default: () => {},
  },
  isSelect: {
    type: Boolean,
    default: false,
  },
  edge:{
    type:Object,
    default:()=>{}
  }
})

const isCollapse = ref(true)
const flowForm = ref({
  label: '',
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  fill: 'rgba(34,25,77,1)',
  stroke: '',
  fontsize: 12,
  color: '',
  radio: 0,
  shadow: false,
  arrowType: '',
  direction: '',
  lineShape: '',
  lineTextColor: '',
  lineFontsize: 12,
  lineColor: '',
  lineSize: 0,
  lineStyle:'normal',
  nodeStrokeWidth:1,
})
const collapseRef = ref(null)
const predefineColors = ref([
  '#D0021B',
  '#F5A623',
  '#F8E71C',
  '#8B572A',
  '#7ED321',
  '#417505',
  '#BD10E0',
  '#9013FE',
  '#4A90E2',
  '#50E3C2',
  '#B8E986',
  '#000000',
  '#4A4A4A',
  '#9B9B9B',
  '#FFFFFF',
])
const isShape = ref(true)
const arrowTypeList = reactive([
  {
    name: '实心箭头',
    type: 'block',
  },
  {
    name: '经典箭头',
    type: 'classic',
  },
  {
    name: '菱形箭头',
    type: 'diamond',
  },
  {
    name: '交叉箭头',
    type: 'cross',
  },
  {
    name: '圆形箭头',
    type: 'circle',
  },
  {
    name: '圆形加号箭头',
    type: 'circlePlus',
  },
  {
    name: '椭圆箭头',
    type: 'ellipse',
  },
  {
    name: '半边箭头',
    type: 'async',
  },
])
const directionList = reactive([
  {
    name: '正向',
    type: 'positive',
  },
  {
    name: '逆向',
    type: 'reverse',
  },
  {
    name: '双向',
    type: 'bothway',
  },
  {
    name: '无',
    type: 'none',
  },
])
const lineShapeList = reactive([
  {
    name: '虚线',
    type: 'dotted',
  },
  {
    name: '实线',
    type: 'solid',
  },
])
const lineStyleList = reactive([
  {
    name:'锐利',
    type:'normal'
  },
  {
    name:'圆角',
    type:'rounded'
  },
  {
    name:'平滑',
    type:'smooth'
  },
  {
    name:'跳线',
    type:'jumpover'
  },
])

watch(
  () => props.nodeConfig,
  (n, o) => {
    console.log(n)
    if (Object.keys(n).length) {
      if (n.shape === 'edge') {
        isShape.value = false

        flowForm.value.lineStyle = props.edge.getConnector() === undefined ? 'normal' : props.edge.getConnector().name
        flowForm.value.label = n.labels === undefined ? '' : n.labels[0].attrs.label.text
        flowForm.value.arrowType = n.attrs.line.targetMarker.name
        flowForm.value.direction =
          n.attrs.line.sourceMarker.name === '' && n.attrs.line.targetMarker.name
            ? 'positive'
            : n.attrs.line.sourceMarker.name && n.attrs.line.targetMarker.name === ''
            ? 'reverse'
            : n.attrs.line.sourceMarker.name && n.attrs.line.targetMarker.name
            ? 'bothway'
            : ''
        flowForm.value.lineTextColor = n.labels === undefined ? '#000000' : n.labels[0].attrs.label.fill
        flowForm.value.lineShape =
          n.attrs.line.strokeDasharray === undefined || n.attrs.line.strokeDasharray === 0 ? 'solid' : 'dotted'
        flowForm.value.lineFontsize = n.labels === undefined ? 12 : n.labels[0].attrs.label.fontSize
        flowForm.value.lineColor = n.attrs.line.stroke
        flowForm.value.lineSize = n.attrs.line.strokeWidth
      } else {
        isShape.value = true

        flowForm.value.nodeStrokeWidth = n.attrs.body.strokeWidth
        flowForm.value.label = n.label || n.attrs.text.text
        flowForm.value.x = n.position.x
        flowForm.value.y = n.position.y
        flowForm.value.width = n.size.width
        flowForm.value.height = n.size.height
        flowForm.value.fill = n.attrs.body.fill
        flowForm.value.stroke = n.attrs.body.stroke
        flowForm.value.fontsize = n.attrs.text.fontSize
        flowForm.value.color = n.attrs.text.fill
        flowForm.value.radio = n.attrs.body.rx || 0
        flowForm.value.shadow = n.attrs.body.hasOwnProperty.call(n.attrs.body, 'filter')
          ? n.attrs.body.filter.args.width > 0
            ? true
            : false
          : false
      }
    } else {
      flowForm.value = {
        label: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: 'rgba(34,25,77,1)',
        stroke: '',
        fontsize: 12,
        color: '',
        radio: 0,
        shadow: false,
        arrowType: '',
        direction: '',
        lineShape: '',
        lineTextColor: '',
        lineFontsize: 12,
        lineColor: '',
        lineSize: 0,
        lineStyle:'normal',
        nodeStrokeWidth:1
      }
    }
  },
  { deep: true }
)

const collapse = () => {
  isCollapse.value = !isCollapse.value
}
const changeConfig = () => {
  var shape = isShape.value ? 'node' : 'edge'
  emit('changeNode', { data: flowForm.value, shape })
}
</script>
<style lang="scss" scoped>
.flow-editor-collapse {
  position: absolute;
  width: 220px;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.85);
  font-size: 12px;
  transition: right 0.5s;
}
.flow-editor-collapse-wrapper {
  position: absolute;
  width: 220px;
  top: 0;
  right: 0;
  bottom: 0;
  transition: left 0.5s;
  border-left: 1px solid #d9d9d9;
}
.flow-json-schema-form-body {
  position: absolute;
  inset: 0px 0px 40px;
  width: 100%;
  height: 100%;
}
.flow-json-schema-form-footer {
  position: absolute;
  left: 0;
  right: 0;
  line-height: 40px;
  height: 40px;
  bottom: 0;
  z-index: 10;
  display: flex;
  justify-content: space-evenly;
  background: #fff;
  border-top: 1px solid #d9d9d9;
}
.flow-editor-icon {
  position: absolute;
  top: 10px;
  left: -10px;
  background-color: #fff;
  width: 20px;
  height: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  &:hover {
    .el-icon {
      color: #225ceb;
      transition: 0.3s all;
    }
  }
}
.tabs {
  height: 40px;
  border-bottom: 1px solid #d9d9d9;
  text-align: center;
  line-height: 40px;
  box-shadow: 0 0 16px -5px rgba(0, 0, 0, 0.2);
  font-size: 13px;
  color: #225ceb;
  font-weight: 600;
}
.flow-editor-form {
  height: 100%;
  padding: 10px;
  max-height: 500px;
}
.type-title {
  margin-top: 18px;
  margin-bottom: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}
:deep(.form-item) {
  .el-form-item__label {
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    font-weight: normal;
  }
  .el-input-number.is-controls-right .el-input__wrapper {
    padding-left: 0;
    padding-right: 25px;
  }
}
:deep(.location) {
  .el-form-item__content {
    justify-content: space-between;
  }
}
:deep(.flex-start) {
  .el-form-item__content {
    justify-content: flex-start;
  }
}
.border {
  border-bottom: 1px solid #ccc;
  padding-bottom: 14px;
}
.not-select {
  color: #aaa;
  font-size: 14px;
  text-align: center;
  margin-top: 80px;
  font-weight: 600;
}
.flow-center-box {
  height: calc(100% - 80px);
}
.flex-center {
  :deep(.el-form-item__content) {
    justify-content: flex-start;
  }
  :deep(.el-color-picker) {
    margin: 0 6px 6px 0;
  }
}
</style>
