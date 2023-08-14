import { defineStore } from "pinia";
import api from '../api/api'

export const workStore = defineStore('work', {
  state: () => {
    return {
      tableFlyData: [], // 飞行段表格数据
      taskAllList: {}, // 任务关系全部数据
      dragEv: null,
      redundant:'',
      taskId:1999,
    }
  },
  actions: {
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
      taskLength:0,
      isPlay:true, // 音频是否首次播放
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
    },
    getTaskLength(data){
      this.taskLength = data.length
    },
    clearTaskLength(){
      this.taskLength = 0
    }
  }
})