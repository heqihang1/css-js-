// 新闻列表
import React, { useEffect } from 'react';
import { allNews } from "../staticResources";
import { Pagination } from 'antd';
import { useNavigate } from "react-router-dom";
import { t } from 'i18next';
import "./newsList.less";
export default function NewsList(props) {
  const navigate = useNavigate();
  const { allNewsList } = allNews()
  const onClickMore = (val) => {
    navigate('/TextPage/Details?type=news&id=' + val.id)
  }
  return (
    <div styleName="newsListContainer">
      <h4 style={{ paddingLeft: '0.53rem', fontSize: '0.4rem', lineHeight: '0.4rem', color: 'rgba(51,51,51,0.3)', marginBottom: '16px', fontFamily: 'Arial-BoldMT' }}>
        All News
      </h4>
      <h6 style={{ paddingLeft: '0.53rem', fontSize: '0.26rem', lineHeight: '0.26rem', color: '#333', marginBottom: '50px', fontFamily: 'SourceHanSansCN-Medium' }}>全部新闻</h6>
      <div styleName='newsList'>
        {allNewsList.map((v, i) => {
          return <div styleName='newsListItem' key={i}>
            <div styleName="newsListItemLeft">
              <span>{v.moon}</span>
              <span>{v.year}</span>
            </div>
            <div styleName='newsListItemCenter'>
              <img src={v.img} alt="" />
            </div>
            <div styleName='newsListItemRight'>
              <div title={v.title}>{v.title}</div>
              <div>{v.text}</div>
              <div onClick={() => {
                onClickMore(v)
              }}>
                More{t("public.more")} {`>>`}
              </div>
            </div>
          </div>
        })}
      </div>
      <div>
        {allNewsList.length > 6 ? <Pagination defaultCurrent={6} total={allNewsList.length} /> : null}
      </div>
    </div>
  )
}
