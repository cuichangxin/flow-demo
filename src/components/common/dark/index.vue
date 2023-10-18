<template>
  <div class="dark-box">
    <el-button text circle class="switch" :class="isDark ? 'isDark-switch' : 'noDark-switch'" @click="toggleDark">
      <el-icon v-if="isDark">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          class="arco-icon arco-icon-sun-fill"
          stroke-width="4"
          stroke-linecap="butt"
          stroke-linejoin="miter"
          data-v-0ee42d02=""
        >
          <circle cx="24" cy="24" r="9" fill="currentColor" stroke="none"></circle>
          <path
            d="M21 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-5ZM21 37.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-5ZM42.5 21a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5h5ZM10.5 21a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5h5ZM39.203 34.96a.5.5 0 0 1 0 .707l-3.536 3.536a.5.5 0 0 1-.707 0l-3.535-3.536a.5.5 0 0 1 0-.707l3.535-3.535a.5.5 0 0 1 .707 0l3.536 3.535ZM16.575 12.333a.5.5 0 0 1 0 .707l-3.535 3.535a.5.5 0 0 1-.707 0L8.797 13.04a.5.5 0 0 1 0-.707l3.536-3.536a.5.5 0 0 1 .707 0l3.535 3.536ZM13.04 39.203a.5.5 0 0 1-.707 0l-3.536-3.536a.5.5 0 0 1 0-.707l3.536-3.535a.5.5 0 0 1 .707 0l3.536 3.535a.5.5 0 0 1 0 .707l-3.536 3.536ZM35.668 16.575a.5.5 0 0 1-.708 0l-3.535-3.535a.5.5 0 0 1 0-.707l3.535-3.536a.5.5 0 0 1 .708 0l3.535 3.536a.5.5 0 0 1 0 .707l-3.535 3.535Z"
            fill="currentColor"
            stroke="none"
          ></path>
        </svg>
      </el-icon>
      <el-icon v-else>
        <svg viewBox="0 0 24 24">
          <path
            d="M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.63 0 8.45-3.5 8.95-8c.09-.79-.78-1.42-1.54-.95A5.403 5.403 0 0 1 11.1 7.5c0-1.06.31-2.06.84-2.89c.45-.67-.04-1.63-.93-1.56z"
            fill="currentColor"
          ></path>
        </svg>
      </el-icon>
    </el-button>
  </div>
</template>

<script setup>
const isDark = ref(true)
const match = matchMedia('(prefers-color-scheme:dark)')
const html = document.querySelector('html')

// 默认模式
const followOs = () => {
  const model = localStorage.getItem('dark-theme')
  if (model === 'auto') {
    if (match.matches) {
      html.classList.remove('light')
      html.classList.add('dark')
      isDark.value = false
      localStorage.setItem('dark-theme', 'dark')
    } else {
      html.classList.remove('dark')
      html.classList.add('light')
      isDark.value = true
      localStorage.setItem('dark-theme', 'auto')
    }
  } else {
    html.classList.remove('light')
    html.classList.add('dark')
    isDark.value = false
  }
}

const toggleDark = () => {
  isDark.value = !isDark.value
  if (html) {
    if (isDark.value) {
      html.classList.remove('dark')
      html.classList.add('light')
      localStorage.setItem('dark-theme', 'auto')
    } else {
      html.classList.remove('light')
      html.classList.add('dark')
      localStorage.setItem('dark-theme', 'dark')
    }
  }
}
match.addEventListener('change', followOs)
watchEffect(() => {
  followOs()
})
</script>

<style scoped lang="scss">
.dark-box {
  margin-right: 20px;
}
.switch {
  border: 1px solid var(--el-border-color);
  font-size: 14px;
}

.isDark-switch {
  .el-icon {
    background-color: #fff !important;
    color: #000;
  }
}

.noDark-switch {
  background-color: rgb(8, 8, 8) !important;

  .el-icon {
    color: #fff;
  }
}
</style>
