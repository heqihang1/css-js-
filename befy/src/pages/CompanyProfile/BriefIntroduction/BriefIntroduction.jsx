import React from 'react';
import { t } from 'i18next';
import "./briefIntroduction.less";

export default function briefIntroduction({ xinwentu }) {
  return (
    <div styleName="blurbContainer">
      <h5>
        <span>ABOUT US</span>
        <span>{t('companyProfile.profile')}</span>
      </h5>
      <div styleName="blurbContainerContent">
        <div styleName="blurbImg">
          <img src={xinwentu} alt="" />
          <div styleName="blurbBj" />
        </div>
        <div styleName="blurbRight">
          <aside >{t('companyProfile.slogan')}</aside>
          <h6>{t('companyProfile.full_name')}</h6>
          <div>
            {t('companyProfile.introduce_one')}
            <br />
            <br />
            {t('companyProfile.introduce_two')}
            <div styleName="shadow" />
          </div>
        </div>
      </div>
    </div>
  )
}
