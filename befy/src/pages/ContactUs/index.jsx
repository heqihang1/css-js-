// 联系我们
import React from 'react';
import "./contactUs.less";
import ContactInformation from "./ContactInformation/ContactInformation";
import CompanyAddress from "./CompanyAddress/CompanyAddress";
import { imagesConfig } from "@/i18n/config.js";

const ContactUs = () => {
  const { img: { lianxi, dizhiIcon2, guanfangzhanghao } } = imagesConfig()
  return (
    <section style={{ width: '100%' }} styleName="contactUsContainer">
      <div styleName="contactUsContainerImg">
        <img src={lianxi} alt="" />
      </div>
      <ContactInformation img={{ guanfangzhanghao }} />
      <CompanyAddress img={{ dizhiIcon2 }} />
    </section>
  )
}

export default ContactUs