<template>
  <div class="box-item" :style="{display:visible?'block' :'none',left:`${x}px`,top:`${y}px`}">
    <span>{{ content }}</span>
    <span class="arrow"></span>
  </div>
</template>
<script setup>
const props = defineProps({
  content:{
    type:String
  },
  visible:{
    type:Boolean,
    default:false
  },
  x:{
    type:Number || String
  },
  y:{
    type:Number || String
  }
})

</script>
<style lang="scss" scope>
.box-item{
  position: absolute;
  background-color: #fff;
  border: 1px solid #ebebeb;
  color: #333;
  padding: 5px 11px;
  font-size: 14px;
  line-height: 20px;
  min-width: 10px;
  word-wrap: break-word;
  border-radius: 4px;
}
.arrow{
  width: 10px;
  height: 10px;
  position: absolute;
  left: 50%;
  top: -5px;
  transform: translateX(-50%);
  /* &::before{
    content: "";
    display: block;
    width: 10px;
    height: 10px;transform: rotate(45deg);
    box-sizing: border-box;
    border-bottom-color: transparent!important;
    border-right-color: transparent!important;
    border-top-left-radius: 2px;
    border: 1px solid #ebebeb;
    background: #fff;
    right: 0;
  } */
}
</style>
