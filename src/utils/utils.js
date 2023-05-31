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