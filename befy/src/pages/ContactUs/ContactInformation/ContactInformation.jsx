import React from 'react';
import { t } from 'i18next';
import "./ContactInformation.less";
import { contact } from "./consts";
export default function ContactInformation({ img: { guanfangzhanghao } }) {
  const { constactList, ewmList } = contact()
  const listComp = (list) => {
    return list.map((v, i) => {
      return <div key={i} styleName="contactBoxItem">
        <div >
          <img src={v.icon} alt="" />
        </div>
        <div styleName="contactBoxItemText">
          <span>{v.title}</span>
          {v.text ? <span style={v.textStyle ? v.textStyle : {}}>{v.text}</span> : null}
          {v.img ? <img src={v.img} style={v.imgStyle ? v.imgStyle : {}} /> : null}
        </div>
      </div>
    })
  }
  return (
    <div styleName="contactInformation">
      <div styleName="contactInformationTitle">
        <span>CONTACT US</span>
        <span>{t('contactUs.contact_us')}</span>
      </div>
      <div styleName="contactContainer">
        <div styleName="breadCrumbs" />
        <div styleName="contactContent">
          {/* <div styleName="verticalLine" /> */}
          {
            constactList.map((v, i) => {
              return <div styleName="contactItem" key={i}>
                {v.type === 'ewm' ? <>
                  <div styleName="contactIcon">
                    <img src={v.icon} alt="" />
                  </div>
                  <div styleName="contactText">
                    <span>{v.title}</span>
                    {v.text ? <span style={v.textStyle ? v.textStyle : {}}>{v.text}</span> : null}
                    {v.img ? <img src={v.img} style={v.imgStyle ? v.imgStyle : {}} /> : null}
                  </div>
                </> : listComp(v.list)}

              </div>
            })
          }
          <div styleName="verticalLine" />
          <div styleName="official">
            <div styleName="officialTitle">
              <img src={guanfangzhanghao} alt="" />
              <div>{t('contactUs.other_id')}</div>
            </div>
            <div styleName="ewmList">
              {
                ewmList.map((v, i) => {
                  return <div key={i} styleName='ewmListItem'>
                    <div>{v.text}</div>
                    <img src={v.img} alt="" />
                  </div>
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
