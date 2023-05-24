<template>
  <div class="container-wrap" :class="{ 'transform': isOut }">
    <el-aside class="aside" :class="{ 'transform': isOut }">
      <el-menu background-color="#545c64" active-text-color="#ffd04b" text-color="#fff" :default-active="activeMenu"
        :unique-opened="true">
        <sidebar-menu :menus="useList"></sidebar-menu>
      </el-menu>
      <mark-poiner :is-out="isOut" @hideMenu="hideMenu"></mark-poiner>
    </el-aside>
  </div>
</template>
<script setup>
import sidebarMenu from './sidebarMenu.vue';
import markPoiner from './mark/markPoiner.vue'
import Cookies from 'js-cookie'

const instance = getCurrentInstance()
const route = useRoute()
const useList = reactive([
  {
    id: '1',
    name: '软件生产看板',
    link: '/broad',
    icon: 'icon-zixiangmukanban',
    hide:false
  },
  {
    id: '2',
    name: '项目管理',
    link: '/pm',
    icon: 'icon-project_management',
    hide:Cookies.get('roleId') == '7' ? true:false,
    children:[
      {
        id:'2-1',
        name:'项目列表',
        link:'/pm/pmList',
        icon:'icon-wenjianjia',
        hide:Cookies.get('roleId') == '7' ? true:false,
      },
      {
        id:'2-2',
        name:'任务需求',
        link:'/pm/taskneed',
        icon:'icon-wenjianjia',
        hide:Cookies.get('roleId') == '7' ? true:false,
      },
    ]
  },
  {
    id: '3',
    name: '测试管理',
    link: '/testManager',
    icon: 'icon-ceshi',
    hide:Cookies.get('roleId') == '7' ? true:false,
    children: [
      {
        id: '3-1',
        name: '测试用例',
        link: '/testManager/testCase',
        icon: 'icon-test-case-group',
        hide:Cookies.get('roleId') == '7' ? true:false,
      },
      {
        id: '3-2',
        name: '测试记录',
        link: '/testManager/testRecord',
        icon: 'icon-ceshijilu',
        hide:Cookies.get('roleId') == '7' ? true:false,
      },
    ]
  },
  {
    id: '4',
    name: '需求追踪',
    link: '/goback',
    icon: 'icon-zhuizongqibeifen',
    hide:Cookies.get('roleId') == '7' ? true:false,
  },
  {
    id: '5',
    name: '我的任务',
    link: '/myTask',
    icon: 'icon-zhuizongqibeifen',
    hide:Cookies.get('roleId') !== '7' ? true:false,
  },
  {
    id: '6',
    name: '系统管理',
    link: '/system',
    icon: 'icon-xitong',
    hide:true,
    children: [
      {
        id: '6-1',
        name: '活动库管理',
        link: '/system/eventRoom',
        icon: 'icon-huodong',
        hide:true,
      },
      {
        id: '6-2',
        name: '工具库管理',
        link: '/system/toolRoom',
        icon: 'icon-gongju1',
        hide:true,
      },
    ]
  }
])
const isOut = ref(false)

const hideMenu = (bol) => {
  isOut.value = bol
  instance.proxy.$bus.emit('resize')
}
const activeMenu = computed(() => {
  return route.path
})
</script>
<style lang="scss" scoped>
.aside {
  width: 180px;
  height: 100%;
  padding: 0;
  transition: width .2s linear;

  &.transform {
    width: 0;
  }

  :deep(.el-menu) {
    width: 100%;
    height: 100%;
  }
}

:deep(.el-sub-menu__title) {
  &:hover {
    background-color: #3d4349 !important;
  }
}

.container-wrap {
  width: 180px;
  height: 100%;
  position: relative;
  transition: width .2s linear;

  &.transform {
    width: 0;
  }

  &:hover {
    .click {
      opacity: 1;
    }
  }

  :deep(.el-menu-item:hover) {
    background-color: #3d4349 !important;
  }
}
</style>
