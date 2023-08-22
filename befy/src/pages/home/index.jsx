import { useNavigate } from "react-router-dom";
// 首页
import React from 'react';
import Banner from "../Components/Banner/Banner";
import { t } from 'i18next';
import { imagesConfig } from "../../i18n/config";



// import 

import "./index.less";

// [
//   '层国人主自研发', '独家专利技术', '独家抗菌涂层'
// ]
const Home = (props) => {
  const strList = [
    t('strList.str_one'), t('strList.str_two'), t('strList.str_three')
  ]
  const { img: { zhuanliIcon, laoshu, aboutUs, chanpintu, bushuqi1, bushuqi2, ioc, chanpintu3, laoshu2
  } } = imagesConfig()
  const navigate = useNavigate();
  return (
    <div styleName='homeContainer'>
      <section styleName='bannerContainer'>
        <Banner />
      </section>
      <section styleName='contentContainer'>
        {/* 公司信息 */}
        <section styleName="aboutUs">
          <div styleName="aboutUsImg">
            <img src={aboutUs} alt="" />
          </div>
          <div styleName="aboutUsText">
            <h3 style={{ fontFamily: 'Arial-BoldMT' }}>About us</h3>
            <span styleName="profile" style={{ fontFamily: 'SourceHanSansCN-Medium' }}>{t('aboutUs.profile')}</span>
            <h3 styleName="companyTitle" style={{ fontFamily: 'SourceHanSansCN-Bold' }}>{t('aboutUs.company_title')}</h3>
            <span styleName="ourCore" style={{ fontFamily: 'Arial-BoldMT' }}>Our core Values</span>
            <h4 styleName="coreValues" style={{ color: '#fff', fontFamily: 'SourceHanSansCN-Bold' }}>{t('aboutUs.core')}</h4>
            <span styleName="highlevel" style={{ fontFamily: 'ArialMT' }}>
              High level of professional innovation <br />
              quality creates brilliance
            </span>
            <h4 styleName="innovate" style={{ fontFamily: 'SourceHanSansCN-Medium' }}>{t('aboutUs.innovate')}</h4>
            <span style={{ fontSize: '0.18rem', color: '#fff', lineHeight: '0.18rem', cursor: 'pointer', fontFamily: 'ArialMT' }}
              onClick={() => {
                navigate('/CompanyProfile')
              }}
            >More{t('share.more')} {`>>`}</span>
          </div>
        </section>
        {/* 产品介绍 */}
        <section styleName="productIntroduction">
          <div styleName="productImg">
            <div styleName="producTitle">
              <h5>PRODUCT</h5>
              <span>{t('homeProduct.introduce')}</span>
            </div>
            <img src={bushuqi2} alt="" style={{ width: '4.34rem', height: '4.24rem', objectFit: 'cover' }} />
          </div>
          <div styleName="productRight">
            <h4>
              {t('homeProduct.name_Food_waste')}
              {/* 科研专利，国人研发 --> t('product.name_one') */}
            </h4>
            <h5>
              {t('homeProduct.tag_Food_waste')}
              {/* 智能酒精捕鼠器研发过程 --> t('product.tag_one') */}
            </h5>
            <div styleName="zhuanliIcon">
              {/* <img src={zhuanliIcon} alt="" /> */}
            </div>
            <span>
              {/* 捕鼠器是对有害鼠类动物的生物和行为学进行仔细观察，并经由专业团队在
              <span style={{ fontSize: '0.36rem', color: '#f09441' }}>20年</span>
              间不断研发及改良。此外，智能酒精捕鼠器的科研及成效取得了独家专利。 */}
              {t('homeProduct.Feature_Food_waste')}
            </span>
            <div styleName="productList">
              {
                strList.map((v, i) => {
                  return <div key={i} styleName="productListItem">
                    <div>
                      <img src={ioc} alt="" />
                    </div>
                    <span>{v}</span>
                  </div>
                })
              }
            </div>
            <div styleName="moreButton"
              onClick={() => {
                navigate('/ProductIntroduction/ProductDetails?type=wasteDetails');
              }}
            >
              More{t('share.more')} {`>>`}
            </div>
          </div>
        </section>
        {/* 产品介绍2 */}
        <section styleName="airEvolutioner">
          <div styleName='airEvolutionerLeft'>
            <h4>{t('homeProduct.name_purifier')}</h4>
            <h5>{t('homeProduct.tag_purifier')}</h5>
            <span>{t('homeProduct.Feature_purifier')}</span>
            <div styleName="moreButton"
              onClick={() => {
                navigate('/ProductIntroduction/ProductDetails?type=airPurifier');
              }}
            >
              More{t('share.more')} {`>>`}
            </div>
          </div>

          <div styleName="airEvolutionerRight">
            <div style={{ width: '2.83rem', height: '2.83rem', borderRadius: '50%', backgroundColor: "#EF9341" }}>
              <span style={{ fontSize: '0.43rem', lineHeight: '0.41rem', color: '#fff', fontWeight: '900', marginBottom: '0.24rem' }}>360°</span>
              <span style={{ fontSize: '0.22rem', lineHeight: '0.41rem', color: '#fff' }}>{t('homeProduct.detail_purifier')}</span>
            </div>
            <img src={chanpintu} alt="" />
          </div>
        </section>
        {/* 新闻 */}
        <section styleName="homeNews">
          <div styleName="newsLeft">
            <article>
              <span style={{ fontSize: '0.24rem', lineHeight: '0.24rem', fontWeight: 500, color: '#333', marginBottom: '26px', display: 'block' }}>{t('homeProduct.patent_purifier')}</span>
              <h4 style={{ fontSize: '0.32rem', lineHeight: '0.32rem', color: '#333', marginBottom: '42px' }}>
                {/* BRT酒精智能捕鼠器 --> patent_int_mousetrap */}
                {t('homeProduct.patent_int_purifier')}
              </h4>
              <div style={{ fontSize: '0.2rem', color: '#E99549', lineHeight: '0.2rem', fontWeight: 500, cursor: 'pointer' }}
                onClick={() => {
                  navigate(`/TextPage/Details?type=news&id=3`)
                }}
              >More{t('share.more')} {`>>`}</div>
            </article>
            <img src={chanpintu3} alt="" style={{ width: '4.4rem', height: '4.34rem', objectFit: 'cover' }} />
          </div>
          <div styleName="newsRight">
            <div styleName="newsRightImge"><img src={laoshu2} alt="" /></div>
            <div style={{ paddingTop: '0.18rem', paddingLeft: '0.36rem' }}>
              <div style={{ fontSize: '0.24rem', lineHeight: '0.24rem', marginBottom: '0.18rem' }}>
                {/* 数数老鼠的祸害 --> patent_tag_mousetrap */}
                {t('homeProduct.patent_tag_purifier')}
              </div>
              <h4 style={{ color: '#fff', fontSize: '0.32rem', lineHeight: '0.32rem', marginBottom: '0.24rem' }}>
                {/* 中国每年糟蹋粮食达250万吨 --> patent_detail_mousetrap */}
                {t('homeProduct.patent_detail_purifier')}
              </h4>
              <div style={{ fontSize: '0.2rem', lineHeight: '0.2rem', cursor: 'pointer' }}
                onClick={() => {
                  navigate('/TextPage/Details?type=news&id=4')
                }}
              >{t('share.know_more')} {`>>`}</div>
            </div>
          </div>
        </section>
      </section>
    </div>

  );
};

export default Home;
