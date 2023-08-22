// 品牌理念
import React from 'react';
import { t } from 'i18next';
import "./brandConcept.less";
// import xinwentu from "@/assets/images/news/xinwentu.avif"
export default function BrandConcept({ gsjj }) {
  return (
    <div styleName="brandConceptContainer">
      <div styleName="brandConceptTitle">
        <h5>Brand Concept</h5>
        <h6>{t('companyProfile.brand')}</h6>
      </div>
      <div styleName="barandContent">
        <div styleName="barandContentImg">
          <img src={gsjj} alt="" />
        </div>
        <div styleName="barandRight">
          <h5>{t('companyProfile.core')}</h5>
          <span>
            <b>{t('companyProfile.core_detail_b')}</b>{t('companyProfile.core_detail')}
            <br />
            <br />
            {t('companyProfile.brand_introduce')}</span>
        </div>
      </div>
    </div>
  )
}
