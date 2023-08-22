// 底部分享组件
import React, { useState } from "react";
import { t } from 'i18next';

import './index.less'
import dh from '@/assets/images/cn/footer/-h-dianhua-icon.png'
import dy from '@/assets/images/cn/footer/-h-douyin-icon.png'
import tt from '@/assets/images/cn/footer/-h-toutiao.png'
import wb from '@/assets/images/cn/footer/-h-weibo.png'
import wx from '@/assets/images/cn/footer/-h-weixin-icon.png'
import xhs from '@/assets/images/cn/footer/-h-xiaohongshu.png'
const imgArr = [
  { id: 1, image: wx },
  { id: 2, image: dy },
  { id: 3, image: xhs },
  { id: 4, image: tt },
  { id: 5, image: wb }
]
const Share = (props) => {
  // 判断是否底部固定
  const [scrollRegularCless, setScrollRegularCless] = useState(false);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [])
  // 滚动事件
  const handleScroll = () => {
    const { footerCont } = props
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    // 合子的高
    const rootHeight = document.getElementById('root').offsetHeight;
    // 80为导航拦
    if (rootHeight - scrollTop <= footerCont.current.offsetHeight * 2 + 100 && !scrollRegularCless) {
      setScrollRegularCless(true)
    } else {
      setScrollRegularCless(false)
    }
  }
  return (
    <div styleName={`shareContainer ${scrollRegularCless ? 'shareStatic' : ''}`}>
      <div styleName="box">
        <div styleName="left">
          <img styleName="dh" src={dh} alt="" />
          <div styleName="dhText">0755-8695-9281</div>
        </div>
        <div styleName="right">
          <div>{t("footer.share")}</div>
          {imgArr.map(item => (
            <div key={item.id}>
              <img styleName="image dh" src={item.image} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Share