<script setup>
let props = defineProps({
  drawerHidden: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object,
    default: () => { }
  }
})
const emit = defineEmits(['closes','updateNode'])

watch([() => props.config, () => props.drawerHidden], (n) => {
  // console.log(n[0]);
  configs.value = n[0]
  if (n[0]) {
    drawerForm.x = n[0].x
    drawerForm.y = n[0].y
    drawerForm.nodeWidth = n[0].style.width
    drawerForm.nodeHeight = n[0].style.height
    drawerForm.colorPicker = n[0].style.fill
    drawerForm.selectShape = n[0].logoIcon.show ? 'rect-node' : n[0].type
    drawerForm.type = n[0].logoIcon.show ? 'image' : n[0].type
  }
  drawer.value = n[1]
})
const configs = ref({})
const drawer = ref(false)
const drawerForm = reactive({
  selectShape: '',
  colorPicker: '',
  nodeWidth: 0,
  nodeHeight: 0,
  x: 0,
  y: 0,
  type: ''
})
const shapeList = reactive([
  {
    value: 'rect-node',
    label: '矩形'
  },
  {
    value: 'circle-node',
    label: '圆形'
  },
  {
    value: 'ellipse-node',
    label: '椭圆'
  },
  {
    value: 'diamond-node',
    label: '菱形'
  }
])
const close = () => {
  emit('closes', false)
}
const selectChange = ()=>{
  configs.value.type = drawerForm.selectShape
  emit('updateNode',configs.value)
}
const colorChange = ()=>{
  configs.value.style.fill = drawerForm.colorPicker
  edit()
}
const wChange = ()=>{
  // if (drawerForm.type == 'image') {

  // }
  configs.value.logoIcon.width = drawerForm.nodeWidth
  configs.value.logoIcon.x = -(drawerForm.nodeWidth/2)
  configs.value.style.width = drawerForm.nodeWidth
  edit()
}
const hChange = ()=>{
  configs.value.logoIcon.height = drawerForm.nodeHeight
  configs.value.logoIcon.y = -(drawerForm.nodeHeight/2)
  configs.value.style.height = drawerForm.nodeHeight
  edit()
}
const xChange = ()=>{
  configs.value.x = drawerForm.x
  edit()
}
const yChange = ()=>{
  configs.value.y = drawerForm.y
  edit()
}
function edit() {
  emit('updateNode',configs.value)
  console.log(configs.value);
}
</script>

<template>
  <el-drawer v-model="drawer" @close="close">
    <el-form :model="drawerForm">
      <div class="panel-title">节点样式</div>

      <el-form-item label="形状">
        <el-select v-model="drawerForm.selectShape" :disabled="drawerForm.type == 'image'" @change="selectChange">
          <el-option v-for="item in shapeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="背景色">
        <el-color-picker v-model="drawerForm.colorPicker" :disabled="drawerForm.type == 'image'" @change="colorChange"  />
      </el-form-item>
      <el-form-item label="大小">
        <div class="size" style="margin-right: 20px;">
          <div class="flex">
            <el-input-number v-model="drawerForm.nodeWidth" class="mx" :min="1" controls-position="right" @keyup.enter="wChange" />
            px
          </div>
          <span>宽</span>
        </div>
        <div class="size">
          <div class="flex">
            <el-input-number v-model="drawerForm.nodeHeight" class="mx" :min="1" controls-position="right" @keyup.enter="hChange" />
            px
          </div>
          <span>高</span>
        </div>
      </el-form-item>
      <el-form-item label="位置">
        <div class="size" style="margin-right: 20px;">
          <div class="flex">
            <el-input-number v-model="drawerForm.x" class="mx" :min="1" controls-position="right" @keyup.enter="xChange" />
            px
          </div>
          <span>左</span>
        </div>
        <div class="size">
          <div class="flex">
            <el-input-number v-model="drawerForm.y" class="mx" :min="1" controls-position="right" @keyup.enter="yChange" />
            px
          </div>
          <span>上</span>
        </div>
      </el-form-item>
      <div class="line"></div>
    </el-form>
  </el-drawer>
</template>
<style lang="scss" scoped>
.panel-title {
  padding: 5px 10px;
  background-color: #e4e4e4;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
}
.size {
  position: relative;

  span {
    font-size: 13px;
    color: #545556;
    position: absolute;
    left: 32%;
    bottom: -28px;
  }
}
:deep(.el-form-item){
  margin-bottom: 24px;
}
.line{
  border-bottom: 1px solid #e4e4e4;
  padding-top: 20px;
}
</style>
