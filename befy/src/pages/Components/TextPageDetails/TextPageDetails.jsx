import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { t } from 'i18next';
import { newsState } from "./conts";
import TextPage from "../TextPage/TextPage";
import { locationParams } from "../../../common";

import "./textPageDetails.less";
export default function TextPageDetails() {
  const urlParams = locationParams()
  const { newsListData, privacyRegulations } = newsState()

  // 新闻组件
  const newsRender = () => {
    const date = newsListData[urlParams.id]
    return <div styleName="newsDetailsBj">
      <div styleName="newsDetails">
        <TextPage
          leftTitle={date.title.leftTitle}
          rightTitle={date.title.rightTitle}
          {...date} />
      </div>
    </div>
  }
  // 隐私条例
  const privacy = () => {
    return <section styleName="privacyPage">
      <h6>{t('footer.privacyPolicy')}</h6>
      <div styleName="privacyPageText">
        {privacyRegulations.map((v, i) => {
          return <div key={i} styleName="privacyPageItem">
            <div styleName="aclPrivacy" />
            <div styleName="privacyPageTitle">{v.title}</div>
            <div styleName="privacyText">{v.text}</div>
          </div>
        })}
      </div>
    </section>

  }
  // 渲染不同组件
  const render = () => {
    const renderDate = {
      news: () => {
        return newsRender()
      },
      privacy: () => {
        return privacy()
      }
    }
    return urlParams?.type && renderDate[urlParams.type]() || <></>
  }
  return render()
}
