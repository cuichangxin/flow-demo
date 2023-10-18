<template>
  <div class="click" @click="out" :style="{ opacity: isOut ? '1' : '' }"
    :class="[direction === 'right' ? 'right' : direction === 'left' ? 'left' : direction === 'top' ? 'top' : 'bottom']">
    <div class="inBg" :class="[direction == 'right' ? 'ti' : direction === 'left' ? 'left' : direction === 'top' ? 'top' : 'bottom']">
    </div>
    <img v-if="color === '#545c64'" src="../../../assets/images/zuojiantou.png" :class="{ 'rotate': isOut }" />
    <img v-else class="black_img" src="../../../assets/images/zuojiantou_black.png" :class="{ 'rotate': isOut, 'top_rotate':isOut && direction === 'top','left_rotate':isOut && direction === 'left' }" />
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
  },
  color: {
    type: String,
    default: '#545c64'
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
    background-color: var(--my-bg-color-2);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    transform: perspective(30px) rotateX(0deg) rotateY(15deg) translateZ(0);
  }

  .top {
    width: 60px;
    height: 18px;
    background-color: var(--my-bg-color-2);
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    transform: perspective(251px) rotateX(0deg) rotateY(12deg) translateZ(0);
  }

  .left {
    width: 18px;
    height: 60px;
    background-color: var(--my-bg-color-2);
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    transform: perspective(351px) rotateX(0deg) rotateY(15deg) translateZ(0);
  }

  .bottom {
    width: 60px;
    height: 18px;
    background-color: var(--my-bg-color-2);
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

  .black_img {
    width: 13px;
    height: 13px;
    /* position: absolute;
    top: 105%;
    left: 2px; */
  }

  &.top {
    right: 50%;
    bottom: 87%;
    transform: translateX(50%);

    .black_img {
      width: 13px;
      height: 13px;
      float: right;
      margin-top: -14px;
      margin-right: 25px;
      transform: rotate(-90deg);
      &.top_rotate{
        transform: rotate(90deg);
      }
    }
  }

  &.left {
    left: -18px;
    top: 50%;
    transform: translateY(-50%);
    .black_img {
      width: 13px;
      height: 13px;
      float: right;
      margin-top: -36px;
      transform: rotate(180deg);
      &.left_rotate{
        transform: rotate(0deg);
      }
    }
  }

  &.right {
    right: -17px;
    top: 50%;
    transform: translateY(-50%);
    .black_img {
      width: 13px;
      height: 13px;
      float: right;
      margin-top: -36px;
      margin-right: 3px;
      &.top_rotate{
        transform: rotate(90deg);
      }
    }
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
.inBg{
  border: 1px solid var(--el-border-color);
}
</style>
