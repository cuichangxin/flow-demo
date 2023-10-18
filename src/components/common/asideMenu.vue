<template>
  <div class="container-wrap" :class="{ transform: isOut, hide_nav: !isNavMenu }">
    <el-aside class="aside" :class="{ transform: isOut, hide_nav: !isNavMenu }">
      <el-menu
        :collapse="isOut"
        active-text-color="#0069F3"
        :default-active="activeMenu"
      >
        <sidebar-menu :menus="useList"></sidebar-menu>
      </el-menu>
      <mark-poiner :is-out="isOut" @hideMenu="hideMenu" color="#fff"></mark-poiner>
    </el-aside>
  </div>
</template>
<script setup>
import sidebarMenu from './sidebarMenu.vue'
import markPoiner from './mark/markPoiner.vue'
import Cookies from 'js-cookie'

const instance = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const useList = reactive([
  {
    id: '1',
    name: '软件生产看板',
    link: '/board',
    icon: 'icon-zixiangmukanban',
    hide: Cookies.get('roleId') == '7' ? true : false,
    target:'_blank'
  },
  {
    id: '2',
    name: '项目管理',
    link: '/pm/pmList',
    icon: 'icon-gongchengguanli',
    hide: Cookies.get('roleId') == '7' ? true : false,
    children: [],
  },
  {
    id: '3',
    name: '测试管理',
    link: '/testManager',
    icon: 'icon-cangkuguanli',
    hide: Cookies.get('roleId') == '7' ? true : false,
    children: [
      {
        id: '3-1',
        name: '测试用例',
        link: '/testManager/testCase',
        // icon: 'icon-nengyuanguanli',
        hide: Cookies.get('roleId') == '7' ? true : false,
      },
      {
        id: '3-2',
        name: '测试记录',
        link: '/testManager/testRecord',
        // icon: 'icon-zonghebaobiao',
        hide: Cookies.get('roleId') == '7' ? true : false,
      },
    ],
  },
  {
    id: '4',
    name: '需求',
    link: '/demand',
    icon: 'icon-shujuzhongxin',
    hide: Cookies.get('roleId') == '7' ? true : false,
    children: [
      {
        id: '4-1',
        name: '需求管理',
        link: '/demand/demandManagement',
        hide: Cookies.get('roleId') == '7' ? true : false,
      },
      {
        id: '4-2',
        name: '需求追踪',
        link: '/demand/goback',
        hide: Cookies.get('roleId') == '7' ? true : false,
      },
    ],
  },
  {
    id: '5',
    name: '我的任务',
    link: '/myTask/list',
    icon: 'icon-renwuguanli',
    hide: Cookies.get('roleId') !== '7' ? true : false,
  },
  {
    id: '6',
    name: '成果管理',
    link: '/results',
    icon: 'icon-chengguoguanli',
    hide: Cookies.get('roleId') == '7' ? true : false,
  },
  {
    id: '7',
    name: '系统管理',
    link: '/system',
    icon: 'icon-xitongguanli',
    hide: true,
    children: [
      {
        id: '7-1',
        name: '活动库管理',
        link: '/system/eventRoom',
        // icon: 'icon-wuzishenling',
        hide: true,
      },
      {
        id: '7-2',
        name: '工具库管理',
        link: '/system/toolRoom',
        // icon: 'icon-xitongshezhi',
        hide: true,
      },
    ],
  },
])
const isOut = ref(false)
const isNavMenu = ref(true)
const routerBlack = ['/modeling', '/work', '/testManager/testCase', '/demandAnalysis', '/demandReview']

watch(
  () => router.currentRoute.value,
  (n) => {
    if (routerBlack.includes(n.path)) {
      isNavMenu.value = false
    } else {
      isNavMenu.value = true
    }
  },
  { immediate: true }
)

const hideMenu = (bol) => {
  isOut.value = bol
  instance.proxy.$bus.emit('resize')
}
const activeMenu = computed(() => {
  return route.path
})
</script>
<style lang="scss" scoped>
.el-menu{
  background-color: var(--header-bg-color);
}
.aside {
  width: 200px;
  height: 100%;
  padding: 0;
  transition: width 0.2s linear;

  &.transform {
    width: 61px;
  }

  :deep(.el-menu) {
    width: 100%;
    height: 100%;
  }
}
.hide_nav {
  width: 0 !important;
}

:deep(.el-sub-menu__title) {
  &:hover {
    background-color: var(--menu-hover-bg-color);
    color: var(--sub-active-text-color);
  }
}

.container-wrap {
  width: 200px;
  height: 100%;
  position: relative;
  transition: width 0.2s linear;

  &.transform {
    width: 61px;
  }

  &:hover {
    .click {
      opacity: 1;
    }
  }

  :deep(.el-menu-item) {
    border-radius: 2px;
    height: 40px;
    margin: 2px 0;
    &:hover {
      background-color: var(--menu-hover-bg-color) !important;
      color: var(--sub-active-text-color);
    }
  }
  :deep(.el-sub-menu .el-menu-item) {
    height: 40px;
  }
  :deep(.el-sub-menu__title) {
    height: 40px;
    border-radius: 2px;
    padding: 0 17px;
  }
  :deep(.el-menu-item.is-active) {
    background-color: var(--menu-hover-bg-color);
    color: var(--sub-active-text-color);
    font-weight: 500;
  }
}
:deep(.el-menu-item .el-menu-tooltip__trigger) {
  padding: 0 17px;
}
.el-menu {
  padding: 5px;
}
</style>
