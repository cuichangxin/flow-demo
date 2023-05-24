<template>
  <div class="control">
    <div class="button" @click="nextStep">下一步</div>
    <div class="button" @click="reset">重置</div>
    <div class="button" @click="send">传输</div>
  </div>
</template>
<script setup>

const nextnum = ref(0)
const resetnum = ref(0)

const nextStep = () => {
  console.log('123');
  nextnum.value++
  localStorage.setItem('next',nextnum.value)
}
const reset = () => {
  resetnum.value++
  localStorage.setItem('reset',resetnum.value)
}
const send = () => {

}
</script>
<style lang="scss" scoped>
.control {
  width: 200px;
  height: 200px;
  margin: 100px auto;

  .button {
    width: 60px;
    height: 30px;
    background: #888585;
    color: #fff;
    border-radius: 6px;
    margin: 3px 0;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }

}
</style>
