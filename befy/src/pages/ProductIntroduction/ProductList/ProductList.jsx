import React from 'react';
import { Select } from 'antd';
import { useNavigate } from "react-router-dom";
import { t } from 'i18next';
import "./productList.less";

export default function ProductList(props) {
  const navigate = useNavigate()
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  // 跳转详情页
  const onJumpPage = (v) => {
    navigate('/ProductIntroduction/ProductDetails?type=' + v.type);
  }
  return (
    <div styleName="productContainerList" >
      <section styleName="productTop">
        <div>{t("product.displayed", { number: 8 })}</div>
        <Select
          defaultValue="ys"
          style={{ width: 200, height: 50 }}
          onChange={handleChange}
          options={[
            { value: 'ys', label: t('product.preset') },
            { value: 'new', label: t('product.new') },
            { value: 'hot', label: t('product.hot') },
            // { value: 'disabled', label: 'Disabled', disabled: true },
          ]}
        />
      </section>
      <style>{`
        .ant-select-arrow {
          transform: translateY(-50%);
        }
      `}</style>

      <section styleName="commoditylist">
        {
          (props?.list || []).map((v, i) => {
            return <div styleName="commoditylistItem" key={i} onClick={() => {
              onJumpPage(v)
            }}>
              {v.bolNew ? <div styleName="bolNew">
                NEW
              </div> : null}
              <div styleName="commodityImg">
                <div styleName="commodityImgBox">
                  <img src={v.img} alt="" />
                </div>
              </div>
              <div style={{ textAlign: 'center', paddingBottom: '0.38rem' }}>
                <div style={{ fontFamily: 'SourceHanSansCN-Bold, SourceHanSansCN', fontSize: '0.16rem', marginBottom: '0.24rem' }}>{v.title}</div>
                <div style={{ fontFamily: 'SourceHanSansCN-Regular', fontSize: '0.14rem', color: '#666', marginBottom: '0.24rem', padding: '0 0.1rem' }}>{v.text}</div>
                <div style={{ fontFamily: 'SourceHanSansCN-Regular', color: '#39b54a', fontSize: '0.14rem', cursor: 'pointer' }}
                >More{t('public.more')}{`>>`}</div>
              </div>

            </div>
          })
        }
      </section>
    </div>
  )
}
