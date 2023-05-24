<template>
  <div class="geMenubarContainer">
    <ul>
      <li v-for="item in list" :key="item.title">{{ item.title }}</li>
    </ul>
  </div>
  <div class="geToolbarContainer" id="toolbar">
    <div class="geToolbar"></div>
  </div>
</template>
<script setup>
const list = reactive([
  {
    title: '文件',
  },
  {
    title: '编辑',
  },
  {
    title: '查看',
  },
  {
    title: '调整图形',
  },

])
</script>
<style lang="scss" scoped>
.geMenubarContainer,
.geToolbarContainer {
  height: 40px;
  width: 100%;
  background-color: #ececec;
  padding: 0 10px;
  border-bottom: 1px solid #c3c4c7;
}

ul {
  margin: 0;
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;

  li {
    list-style: none;
    font-size: 15px;
    margin: 0 16px 0 0;
    padding: 4px;
    cursor: pointer;
  }
}

.geToolbarContainer {
  height: 38px;
  position: relative;
}

.geToolbar {
  padding: 5px 0px 0px 6px;
  box-shadow: inset 0 1px 0 0 #fff;
}

:deep(.g6-component-toolbar) {
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none;
  padding:0 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  li {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    padding: 3px;
    img {
      width: 18px;
      height: 18px;
    }
    &:hover{
      background-color: #dcdde0;
    }
  }
  .right{
    float: right;
  }
  .add_j{
    display: flex;
    img{
      &:nth-child(2){
        width: 14px;
        height: 13px;
        margin-top: 2px;
      }
    }
  }
}</style>
