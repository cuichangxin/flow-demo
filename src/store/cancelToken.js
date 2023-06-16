import { defineStore } from "pinia";

export const useCancelToken = defineStore('cancelToken',{
  state:()=>{
    return {
      cancelTokenArr:[]
    }
  },
  actions:{
    addCancelToken(cancel){
      if (!this.cancelTokenArr.includes(cancel)) {
        this.cancelTokenArr.push(cancel)
      }
    },
    clearCancelToken(cancel){
      this.cancelTokenArr.forEach(c=>{
        if (c) {
          c()
        }
      })
      this.cancelTokenArr = []
    }
  }
})