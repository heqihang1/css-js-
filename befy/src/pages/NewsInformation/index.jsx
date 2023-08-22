// 新闻资讯
import React from "react";
import NewsContext from "./NewsContext";
import NewsVideo from "./NewsVideo";
import "./newsInformation.less"
import { imagesConfig } from "@/i18n/config.js";

import NewsList from "./NewsList/NewsList";

const NewsInformation = (props) => {
  const { img: { newBanner } } = imagesConfig()
  return (
    <div styleName="newsContainer">
      <header>
        <img
          title=""
          src={newBanner}
        />
      </header>
      <section styleName="newsContent">
        {/* 内容 */}
        <NewsContext />
        {/* 新闻视频 */}
        <NewsVideo />
        {/* 新闻列表 */}
        <NewsList {...props} />
      </section>
    </div>
  )
}

export default NewsInformation