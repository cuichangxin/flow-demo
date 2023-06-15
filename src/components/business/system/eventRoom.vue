<template>
  <div class="iframe_wrap">
    <iframe id="iframe" class="iframe" src="http://192.168.30.117:3000/#/duty" frameborder="0"></iframe>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.iframe_wrap{
  height: calc(100% - 95px);
  margin: 20px;
}
.iframe {
  width: 100%;
  height: 100%;
  border: 1px solid #dadada;
}
</style>
