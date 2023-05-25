<template>
  <template v-if="checkType(menus)">
    <template v-for="item in menus" :key="item.id">
      <el-sub-menu v-if="item.children && item.children.length" :index="item.id">
        <template #title>
          <i class="iconfont icon "
            :class="[item.openFlag && item.flagIdx == item.id ? 'icon-jianshu' : 'icon-jiashu']"></i>
          <span>{{ item.label }}</span>
        </template>
        <testElMenu :menus="item.children" :drag="drag" :icon="icon"></testElMenu>
      </el-sub-menu>

      <el-tooltip v-else :content="item.label" placement="right" effect="light">
        <el-menu-item :index="item.id" :draggable="drag" :class="{ 'menu-icon': drag }" :data-label="item.label"
          :data-id="item.id" :data-img="item.img" :data-shape="item.shape" :data-fill="item.fill"
          :data-list="JSON.stringify(item.list)" @dragstart="(e) => dragstart(e, item)">
          <template #title>
            <i class="iconfont icon iconm" :class="[icon]"></i>
            <span>{{ item.label }}</span>
          </template>
        </el-menu-item>
      </el-tooltip>
    </template>
  </template>
  <el-menu-item v-else :index="menus.id">
    <template #title>
      <span>{{ menus.label }}</span>
    </template>
  </el-menu-item>
</template>
<script setup>
import { allStore } from '../../store';

const store = allStore()
const props = defineProps({
  menus: {
    type: Array,
    default: () => [],
  },
  drag: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "icon-moxing",
  },
  openFlag: {
    type: Object,
    default: () => { }
  }
})
function checkType(menus) {
  return Array.isArray(menus);
}
watchEffect(() => {
  if (props.openFlag !== undefined && Object.keys(props.openFlag).length) {
    props.menus.forEach(item => {
      if (item.id == props.openFlag.index) {
        item.openFlag = props.openFlag.flag
        item.flagIdx = props.openFlag.index
      }
    })
  }
})
const dragstart = (e, v) => {
  console.log(v);
  store.dragstartItem = v
}
</script>
<style lang="scss" scoped>
.icon {
  margin-right: 10px;
  color: #5b5959;
}

.iconm {
  font-size: 20px;
  margin-right: 4px;
}

:deep(.el-sub-menu__title),
:deep(.el-menu-item) {
  height: 48px;
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>