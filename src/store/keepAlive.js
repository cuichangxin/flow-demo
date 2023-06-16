import { defineStore } from 'pinia'

export const useKeepAliver = defineStore('keepAlive',{
  state: ()=>{
    return {
      caches:[]
    }
  },
  actions:{
    addKeepAlive(name){
      if (!this.caches.includes(name)) {
        this.caches.push(name)
      }
    },
    removeKeepAlive(name){
      this.caches = this.caches.filter((item)=>{item !== name})
    },
    clearKeepAlive(){
      this.caches = []
    }
  }
})