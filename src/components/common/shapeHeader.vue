<template>
  <div class="menu-wrap">
    <el-menu mode="horizontal" @select="itemClick">
      <shapeElMenu :menus="list" :tabIdx="tabIdx"></shapeElMenu>
      <div v-if="tabIdx === 2" class="change-over-btn">
        <el-button type="primary" text @click="changeView">切换视图</el-button>
      </div>
    </el-menu>
  </div>
</template>
<script setup>
import shapeElMenu from './shape/shapeElMenu.vue'

const router = useRouter()
const { proxy } = getCurrentInstance()
const props = defineProps({
  canRedo: {
    type: Boolean,
    default: false,
  },
  canUndo: {
    type: Boolean,
    default: false,
  },
  tabIdx: {
    type: Number,
  },
})
const emit = defineEmits(['handleMenu'])
const list = ref([
  {
    title: '文件',
    icon: 'icon-wenjian1',
    children: [
      {
        title: '保存',
        hide:false
      },
      {
        title: '另存为',
        hide:false
      },
    ],
  },
  {
    title: '编辑',
    icon: 'icon-bianji1',
    children: [
      {
        title: '撤销',
        hide:false
      },
      {
        title: '重做',
        hide:false
      },
    ],
  },
  {
    title: '查看',
    icon: 'icon-chakan',
    children: [
      {
        title: '格式',
        hide:false
      },
      {
        title: '缩略图',
        hide:false
      }
    ],
  },
  {
    title:'操作',
    icon:'icon-caozuo-bianji',
    children:[
      {
        title:'重新生成',
        hide:false
      },
      {
        title:'智能辅助',
        hide:false
      },
      {
        title:'视图对照'
      },
      {
        title:'智能验证'
      }
    ]
  }
])
const viewFlag = ref(false)
const pathWhite = ref(['/modeling','/work'])

const changeView = () => {
  viewFlag.value = !viewFlag.value
  proxy.$bus.emit('changeView', viewFlag.value)
}
const itemClick = (index, indexPath, item) => {
  emit('handleMenu', index)
}

watch(()=>router.currentRoute.value,(n)=>{
  if (pathWhite.value.includes(n.path)) {
    list.value[3].children[1].hide = false
  }else {
    list.value[3].children[1].hide = true
  }
},{immediate:true})

watchEffect(() => {
  list.value.forEach((item) => {
    if (item.children && item.children.length) {
      item.children.forEach((child) => {
        if (child.title === '撤销') {
          child.disabled = !props.canUndo
        }
        if (child.title === '重做') {
          child.disabled = !props.canRedo
        }
      })
    }
    if (item.title === '恢复视图') {
      item.hide = props.tabIdx !== 0
    }
  })
})
</script>
<style lang="scss" scoped>
.menu-wrap {
  display: flex;
}
.el-menu {
  height: 40px;
  width: 100%;
  border-radius: 2px;
  margin-bottom: 10px;
}

.el-menu--horizontal {
  border-bottom: 1px solid #d2d2d2;
  margin-bottom: 0;
}

:deep(.el-sub-menu__title),
:deep(.el-menu-item) {
  border-radius: 3px !important;
}
.change-over-btn {
  float: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
}
</style>
