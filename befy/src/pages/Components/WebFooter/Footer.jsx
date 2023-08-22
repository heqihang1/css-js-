/**
 *  底部组件
 * 
 */
import React, { useRef } from "react";
import Share from "./Share";
import "./footer.less";
import { imagesConfig } from "@/i18n/config.js";
import { t } from 'i18next';
import { useNavigate } from "react-router-dom";




export default function Footer() {
  const navList = [{ text: t("header.home"), path: '/Home' },
  // { text: t("header.news"), path: "/NewsInformation" },
  { text: t("header.productTitle"), path: '/ProductIntroduction' }, { text: t("footer.aboutUs"), path: '/ContactUs' }]
  const { img: { logo,
    dizhiIcon,
    wangzhiIcon,
    youxiangIcon } } = imagesConfig()
  const CompanyInformationList = [
    {
      img: dizhiIcon,
      title: t("footer.address"),
      id: 1
    },
    {
      img: youxiangIcon,
      title: 'info@baoerfeiyang.cn',
      id: 2
    },
    {
      img: wangzhiIcon,
      title: 'www.baoerfeiyang.cn',
      id: 3
    }
  ]
  const footerRef = useRef();
  const navigate = useNavigate();
  return (
    <footer styleName="footer" ref={footerRef}>
      <div styleName="shareBox">
        <Share footerCont={footerRef} />
      </div>
      <section styleName="minFooter">
        <article>
          <div styleName="footerLogo">
            <img src={logo} alt="" />
          </div>
          <div styleName="footerText">
            <div styleName="footerTextTitle">{t("footer.companyName")}</div>
            {
              CompanyInformationList.map((item) => {
                return <div key={item.id} styleName='footerTextList'><img src={item.img} alt="" style={{ width: '0.18rem' }} />
                  <span>{item.title}</span>
                </div>
              })
            }
          </div>
        </article>
        <aside>
          {navList.map((item, i) => {
            return <div key={i} styleName="navList" onClick={() => {
              navigate(item.path)
            }}>
              {item.text}
            </div>
          })}
        </aside>
      </section>
      <div styleName="filingNumber">
        <span onClick={() => {
          navigate('/TextPage/Details?type=privacy')
        }}>{t('footer.privacyPolicy')}</span>
        {/* <span>备案号：xxxxxxxxxxxxxxxxxxxxxx</span> */}
      </div>
    </footer>
  )
}
