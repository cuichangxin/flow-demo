import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'


const constantRoutes = [
  {
    path: '/',
    name: 'index',
    // redirect: '/myTask',
    redirect: to=>{
      if (Cookies.get('userId') === '7') {
        return {path:'/testManager/testRecord'}
      }else {
        return {path:'/myTask'}
      }
    },
    component: () => import('@/page/index.vue'),
    children: [
      {
        path: '/work',
        name: 'work',
        component: () => import('@/page/work.vue'),
        meta: { title: '应用架构工具' }
      },
      {
        path: '/modeling',
        name: 'modeling',
        component: () => import('@/page/modeling.vue'),
        meta: { title: '领域算法工具' }
      },
      {
        path: '/goback',
        name: 'goback',
        component: () => import('@/page/goback.vue'),
        meta: { title: '需求追踪' }
      },
      {
        path: '/emulation',
        name: 'emulation',
        component: () => import('@/page/emulation.vue'),
        meta: { title: '仿真测试环境' }
      },
      {
        path: '/pm',
        name: 'pm',
        redirect: '/pm/pmList',
        // component: () => import('@/page/pm.vue'),
        meta: { title: '项目管理' },
        children: [
          {
            path: '/pm/pmList',
            name: 'pmList',
            component: () => import('../components/business/pm/pmList.vue'),
            meta: { title: '列表' }
          },
          {
            path: '/pm/taskneed',
            name: 'taskneed',
            component: () => import('../components/business/pm/taskNeed.vue'),
            meta: { title: '导入任务需求' }
          },
          {
            path: '/pm/configMessage',
            name: 'configMessage',
            component: () => import('../components/business/pm/configMessage.vue'),
            meta: { title: '配置信息',keepAlive:true }
          },
          {
            path: '/pm/messageAffirm',
            name: 'messageAffirm',
            component: () => import('../components/business/pm/messageAffirm.vue'),
            meta: { title: '信息确认' }
          },
        ]
      },
      {
        path: '/myTask',
        name: 'myTask',
        // component: () => import('@/page/myTask.vue'),
        redirect: '/myTask/list',
        meta: { title: '我的任务' },
        children: [
          {
            path: '/myTask/list',
            name: 'taskList',
            component: () => import('@/page/myTask.vue'),
            meta: { title: '列表' }
          }
        ]
      },
      {
        path: '/testManager',
        name: 'testManager',
        // component: () => import('@/page/testManager.vue'),
        redirect: '/testManager/testCase',
        meta: { title: '测试管理' },
        children: [
          {
            path: '/testManager/testCase',
            name: 'testCase',
            component: () => import('../components/business/testManager/testCase.vue'),
            meta: { title: '测试用例' }
          },
          {
            path: '/testManager/testRecord',
            name: 'testRecord',
            component: () => import('../components/business/testManager/testRecord.vue'),
            meta: { title: '测试记录' }
          },
        ]
      },
      {
        path: '/system',
        name: 'system',
        redirect: '/system/toolRoom',
        meta: { title: '系统管理' },
        children: [
          {
            path: '/system/toolRoom',
            name: 'toolRoom',
            component: () => import('../components/business/system/toolRoom.vue'),
            meta: { title: '工具库管理' }
          },
          {
            path: '/system/eventRoom',
            name: 'eventRoom',
            component: () => import('../components/business/system/eventRoom.vue'),
            meta: { title: '活动库管理' }
          },
        ]
      },
      {
        path: '/demandAnalysis',
        name: 'demandAnalysis',
        component: () => import('@/page/demandAnalysis.vue'),
        meta: { title: '需求分析' }
      },
      {
        path: '/demandReview',
        name: 'demandReview',
        component: () => import('@/page/demandReview.vue'),
        meta: { title: '需求评审' }
      }
    ]
  },
  {
    path: '/board',
    name: 'board',
    component: () => import('@/page/broad.vue'),
    meta: { title: '软件生产看板' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/page/login.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/page/test.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/page/404.vue')
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: '/404',
    hidden: true
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

export default router