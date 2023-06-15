import { defineStore } from "pinia";
import api from '../api/api'

export const workStore = defineStore('work', {
  state: () => {
    return {
      isTableShow: {}, // 显示属性表格
      taskPropertyData: {}, // 修改属性后的数据
      scaleLineData: '', // 获取 刻度线的位置
      tableFlyData: [], // 飞行段表格数据
      taskAllList: {}, // 任务关系全部数据
      dragEv: null,
      taskListStore:[]
    }
  },
  actions: {
    setShowTable(data) {
      this.isTableShow = data
    },
    setTaskProperty(data) {
      this.taskPropertyData = JSON.parse(JSON.stringify(data))
    },
    setScaleLineData(data) {
      this.scaleLineData = data
    },
    setTableFlyData(data) {
      this.tableFlyData = data
    },
    setTaskAllData(data) {
      this.taskAllList[data[1]] = data[0]
    },
  }
})

export const allStore = defineStore('all',{
  state:()=>{
    return {
      taskDetail:{},
      userId:'',
      taskId:'',
      projectInfo:{}, // 新建项目配置信息
      dragstartItem:{}, // 模型拖动的数据
    }
  },
  actions:{
    taskDetail(data){
      api.saveTaskDetail({
        taskId:this.taskId,
        daTree:JSON.stringify(data.list)
      }).then((res) => {
        console.log(res);
      })
    }
  }
})