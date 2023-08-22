import React from 'react'
import { allNews } from "./staticResources";
import './newsInformation.less';
import { imagesConfig } from '../../i18n/config';
import { t } from 'i18next';

export default function NewsVideo() {
  const { newsContentText } = allNews()
  const { img: { ContainerBj, btn } } = imagesConfig()
  return (
    <section styleName='videoNewsContainer'>
      <div styleName="videoNewsContainerBj">
        <img src={ContainerBj} alt="" />
      </div>
      {/* <div styleName="imgNewsContainerBj">
      </div> */}
      <article styleName='videoLeftText'>
        <h6>{newsContentText.videotitle}</h6>
        <span style={{ display: 'block', marginBottom: '56px' }}>{newsContentText.videoContentText}</span>
        <div styleName="moreBtn">More{t("public.more")}{`>>`}</div>
      </article>
      <div styleName='videoRightPlay'>
        <img src={btn} alt="" />
      </div>
      {/* <video class="art-video"
        preload="metadata"
        crossorigin="anonymous"
        autoplay=""
        src="https://vd3.bdstatic.com/mda-njqcagfz4y0dmgyj/sc/cae_h264/1666687884690740901/mda-njqcagfz4y0dmgyj.mp4?v_from_s=hkapp-haokan-hna&amp;auth_key=1689241772-0-0-f7298abf2c09bf353837d0e32cb8c9f9&amp;bcevod_channel=searchbox_feed&amp;pd=1&amp;cr=2&amp;cd=0&amp;pt=3&amp;logid=2972199676&amp;vid=4775086662887600797&amp;abtest=&amp;klogid=2972199676">

      </video> */}
    </section>
  )
}
