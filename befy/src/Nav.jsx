import React, { useRef, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { imagesConfig } from "@/i18n/config.js";

// 端口好后缀
const hostObj = {
  cn: 'baoerfeiyang.cn',
  hk: 'biofuture.hk'
}

export default () => {
  const { i18n } = useTranslation();
  const { setLanguage, img: { navLogo } } = imagesConfig()

  const [languagePage, setLanguagePage] = useState((window.location.host).includes(".hk") ? "zhhk" : "zh")
  const navs = [
    {
      path: "/Home",
      name: t("header.home"),
      id: "Home",
    },
    // {
    //   path: "/NewsInformation",
    //   name: "新闻资讯",
    //   id: "NewsInformation"
    // },
    {
      path: "/ProductIntroduction",
      name: t("header.productTitle"),
      id: "ProductIntroduction"
    },
    {
      path: "/CompanyProfile",
      name: t("header.companyProfile"),
      id: "CompanyProfile"
    },
    {
      path: "/ContactUs",
      name: t("header.contactUs"),
      id: "ContactUs"
    },
  ];
  const language = [{
    text: "简",
    code: "zh"
  }, {
    text: "繁",
    code: "zhhk"
  }, {
    text: "EN",
    code: 'en'
  }]

  const navigate = useNavigate();
  const getLang = async (val) => {
    await i18n.changeLanguage(val);
  };
  const navSelected = useMemo(() => {
    window.scrollTo(0, 0)
    return window.location.pathname
  }, [window.location.href])

  // 切换url地址
  const setWebUrl = (val) => {
    const url = window.location.href;
    const urlHost = window.location.host;
    const host = {
      'en': hostObj.hk,
      'zhhk': hostObj.hk,
      'zh': hostObj.cn
    }
    // 切换的语言和当前端口不一样时切换端口
    if (!urlHost.includes(host[val])) {
      // 不用本地
      const simulationHost = urlHost.includes(hostObj.hk) ? hostObj.hk : hostObj.cn
      let newUrl = url.replace(simulationHost, host[val])
      // console.log(newUrl);
      // 如果跳转的是英文则需要页面变为英文
      const str = newUrl.includes("?type") ? '&language=en' : '?language=en'
      if (val === 'en' && !newUrl.includes("language=en")) {
        newUrl += str
      }
      // 去除后缀
      if (newUrl.includes("language=en") && val !== 'en') {
        newUrl = newUrl.replace(str, '')
      }
      window.location = newUrl
    }
  }
  useEffect(() => {
    if (window.location.search.includes('language=en')) {
      setLanguage('en')
      setLanguagePage('en')
      getLang('en')
    } else {
      setLanguage((window.location.host).includes(".hk") ? "zhhk" : "zh")
      getLang((window.location.host).includes(".hk") ? "zhhk" : "zh")
      setLanguagePage((window.location.host).includes(".hk") ? "zhhk" : "zh")
    }
  }, [])
  return (
    <>
      <header>
        <ul className="nav">
          <img src={navLogo} alt="" />
          {navs.map((item, index) => (
            <li
              key={index}
              className={navSelected === item?.path || (navSelected === '/' && index === 0) ?
                "highlightNav" :
                ""}
              onClick={() => {
                navigate(item.path);
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
        {/* <div className="rightText">
          {language.map((v, index) => {
            return <div key={v.code}
              className={v.code === languagePage ? "highLanguage" : ""}
              onClick={() => {
                if (!window.location.host.includes('.cn') && v.code !== 'zh') {
                  getLang(v.code)
                  setLanguagePage(v.code)
                  setLanguage(v.code)
                }
                // 切换时替换地址
                setWebUrl(v.code)
              }}
            >{v.text}</div>
          })}
        </div> */}
        <div className="navBj" />
      </header>
      <style jsx>{`
        .nav {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          left: 25%;
          height: 80px;
          z-index: 10;
          .highlightNav{
            color: #39B549;
          }
          > li {
            margin-left: 6em;
            list-style-type: none;

            &:hover {
              cursor: pointer;
              color: #39B549;
            }
          }
          >img{
            min-width: 100px;
            height: 30px;
            marginRight: 5em;
          }
        }
        .navBj{
          height:80px;
          background-color:#F1FBF7;
          width:100%;
          position: fixed;
          z-index: 8;
        }
        .rightText{
          position: fixed;
          display: flex;
          z-index: 10;
          right: 8%;
          height: 80px;
          align-items: center;
          div{
            margin-left:20px;
            width: 0.3rem;
            height: 0.3rem;
            background: #fff;
            text-align: center;
            line-height: 0.3rem;
            border-radius: 100%;
            cursor: pointer;
            color:#000
          }
          .highLanguage{
            background: #000;
            color:#fff
          }
        }
       
      `}</style>
    </>
  );
};
