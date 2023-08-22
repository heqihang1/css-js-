// 公司简介
import React from 'react';
import BriefIntroduction from "./BriefIntroduction/BriefIntroduction";
import BrandConcept from "./BrandConcept/BrandConcept";
import { imagesConfig } from "@/i18n/config.js";
import "./companyProfile.less";

const CompanyProfile = () => {
  const { img: { company, xinwentu, gsjj } } = imagesConfig()
  return (
    <section style={{ width: '100%' }} styleName='companyContainer'>
      <div styleName='companyContainerBanner'>
        <img src={company} alt="" />
      </div>
      {/* 简介信息 */}
      <BriefIntroduction xinwentu={xinwentu} />
      {/* 品牌理念 */}
      <BrandConcept gsjj={gsjj} />
    </section>
  )
}

export default CompanyProfile