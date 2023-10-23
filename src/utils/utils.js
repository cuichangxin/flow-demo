import G6 from '@antv/g6'
export function containsNumber(str) {
  var reg = /\d/;
  return reg.test(str);
}
export function randomRbg(index) {
  const colorArr = ['#a7de84', '#89dcdd']
  if (index % 2 == 0) {
    return colorArr[0]
  } else {
    return colorArr[1]
  }
}
export function fittingString(str, maxWidth, fontSize) {
  let currentWidth = 0;
  let res = str;
  const pattern = new RegExp('[\u4E00-\u9FA5]+');
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth) return;
    if (pattern.test(letter)) {
      currentWidth += fontSize;
    } else {
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth) {
      res = `${str.substr(0, i)}\n${str.substr(i)}`;
    }
  });
  return res;
}

export function getImgSize(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    // 如果有缓存直接返回
    if (img.complete) {
      resolve({ width: img.width, height: img.height })
    } else {
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
    }
  })
}
/**
 * 判断path是否为外链
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
export function formatTime(time) {
  var date = time ? new Date(time) : new Date()
  var year = date.getFullYear()
  var month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var createTime = year + '-' + month + '-' + day
  return createTime
}

// 求两数之间的所有数字
export function week(arr, arr2) {
  let a = parseInt(arr)
  let b = parseInt(arr2)
  let c = []
  if (b - a === 1) {
    return b - a
  } else if (arr - b < 0) {
    const number = Math.abs(a - b) + 1
    for (let i = a; i < a + number; i++) {
      c.push(i)
    }
    const random = Math.floor(Math.random() * c.length - 1)
    c.splice(random, 1)

  } else if (a - b === 0) {
    c.push(a)
  } else if (a - b > 0) {
    const number = Math.abs(a - b)
    for (let i = a; i > number; i--) {
      c.push(i)
    }
  }
  return c
}

export function getImgUrl(img) {
  return new URL(`@/assets/images/${img}`, import.meta.url).href
}
export function getSvgImgUrl(img) {
  return new URL(`@/assets/svg/${img}`, import.meta.url).href
}