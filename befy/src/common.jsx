// 获取url参数
const locationParams = () => {
  const url = window.location.search
  const locationType = {}
  if (url.indexOf("?") != -1) {
    const newUrl = (url.slice(1, url.length)).split('&')
    newUrl.forEach((v) => {
      console.log();
      locationType[v.split('=')[0]] = v.split('=')[1]
    })
  }
  return locationType
}

export {
  locationParams
}