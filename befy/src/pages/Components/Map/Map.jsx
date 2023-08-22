import React from 'react'
import AMapLoader from '@amap/amap-jsapi-loader';
import { t } from 'i18next';
import "./map.less"
export default function GugeMap() {
  let map = {}
  const maps = () => {
    AMapLoader.load({
      key: "7f50c037210980c08ce221e495223a88",                     // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0",              // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [''],               // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then(AMap => {
      const lng = 113.893244;
      const lat = 22.525924;
      map = new AMap.Map("map", { //设置地图容器id
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 15, //初始化地图层级
        center: [lng, lat] //初始化地图中心点        //初始化地图级别
      })
      const marker = new AMap.Marker({
        position: [lng, lat]//位置
      })
      map.add(marker);//添加到地图
      const path = [
        [113.891879, 22.527264],
        [113.893085, 22.526441],
        [113.892524, 22.525527],
        [113.891818, 22.524984],
        [113.890703, 22.526053]
      ]
      //  范围图
      // const polygon = new AMap.Polygon({
      //   path: path,
      //   strokeColor: "#FF33FF",
      //   strokeWeight: 1,
      //   strokeOpacity: 0.2,
      //   fillOpacity: 0.2,
      //   fillColor: '#1791fc',
      //   zIndex: 50,
      // })
      // map.add(polygon)

      //构建自定义信息窗体
      const infoWindow = new AMap.InfoWindow({
        anchor: 'bottom-center',
        content: t('contactUs.address'),
        offset: new AMap.Pixel(1, -30)
      });
      infoWindow.open(map, [lng, lat])
      // map.on('click', (e) => {
      //   console.log(e);
      //   new AMap.Marker({
      //     position: e.lnglat,
      //     map: map
      //   })
      // })
    })
  }
  React.useEffect(() => {
    maps()
  }, [t('contactUs.address')])
  return (
    <>
      <div id="map" style={{ width: '100%', height: '100%' }}>
      </div>
      <style>{`
      .amap-info-close {
          display: none;
      }
     .amap-logo{
      display: none !important;
     }
    `}</style>
    </>
  )
}
