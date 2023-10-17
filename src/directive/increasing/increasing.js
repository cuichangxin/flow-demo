/**
 * v-increasing 数字递增
*/
export default {
  mounted(el, binding, vnode) {
    const { value } = binding
    let count = 0 // 初始值
    let rate = 40 // 定时器间隔
    let innerNum = el.innerText // 页面的值
    let average = innerNum / (value / rate) // 数字每次跳动的值
    if (parseInt(value) !== 0) {
      const timer = setInterval(() => {
        count += average
        el.innerText = count.toFixed(0)
        if (count > innerNum) {
          count = innerNum
          el.innerText = count
          clearInterval(timer)
        }
      }, rate)
    }
  },
}