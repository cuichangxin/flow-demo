<template>
  <div class="click" @click="out" :style="{ opacity: isOut ? '1' : '' }"
    :class="[direction === 'right' ? 'right' : 'bottom']">
    <div :class="[direction == 'right' ? 'ti' : 'bottom']">
    </div>
    <img src="../../../assets/image/zuojiantou.png" :class="{ 'rotate': isOut }" />
  </div>
</template>
<script setup>
const props = defineProps({
  isOut: {
    type: Boolean,
    required: true
  },
  direction: {
    type: String,
    default: 'right'
  }
})
const emit = defineEmits(['hideMenu'])
const out = () => {
  const isActive = !props.isOut
  emit('hideMenu', isActive)
}
</script>
<style lang="scss" scoped>
.click {
  cursor: pointer;
  position: absolute;
  z-index: 99;
  opacity: 0;
  transition: opacity .3s ease-in-out;

  .ti {
    width: 18px;
    height: 60px;
    background-color: #545c64;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    transform: perspective(30px) rotateX(0deg) rotateY(15deg) translateZ(0);
  }

  .bottom {
    width: 60px;
    height: 18px;
    background-color: #545c64;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    transform: perspective(251px) rotateX(0deg) rotateY(12deg) translateZ(0);
  }

  img {
    width: 15px;
    height: 15px;
    float: left;
    margin-top: -40px;
    position: relative;
    z-index: 99;

    &.rotate {
      transform: rotate(180deg);
    }
  }

  &.right {
    right: -17px;
    top: 50%;
    transform: translateY(-50%);
  }

  &.bottom {
    right: 50%;
    top: 100%;
    transform: translateX(50%);

    img {
      width: 15px;
      height: 15px;
      z-index: 99;
      position: absolute;
      left: 50%;
      bottom: 2px;
      transform: translateX(-50%) rotate(90deg);
      &.rotate {
        transform: translateX(-50%) rotate(270deg);
      }
    }
  }
}
</style>
