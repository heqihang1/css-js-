import React from 'react';
import { t } from 'i18next';
import "./CompanyAddress.less";

import Map from "../../Components/Map/Map";
export default function CompanyAddress({ img: { dizhiIcon } }) {
  return (
    <div styleName="addressContainer">
      <div styleName="addressTitle">
        <span>Company Address</span>
        <span>{t('contactUs.company_address')}</span>
      </div>
      <div styleName="addressMap">
        <div styleName="addressMapBj" />
        <div styleName="addressMapContent">
          <div styleName="address">
            <div styleName="addressImg">
              <img src={dizhiIcon} alt="" />
            </div>
            <span>{t('contactUs.company_address_detail')}</span>
          </div>
          <div styleName="addressGis">
            <Map />
          </div>
        </div>

      </div>
    </div>
  )
}
