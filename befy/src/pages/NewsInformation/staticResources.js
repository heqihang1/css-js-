import { imagesConfig } from "@/i18n/config.js";
import { t } from 'i18next';


function allNews() {
  const { img: { laoshu,
    newsLaoshu2,
    newsXinwentu, } } = imagesConfig()
  // 文本内容
  const newsContentText = {
    titleEn: 'NEWS',
    titleCn: t("header.news"),
    sublabel1: t("newsText.sublabel1"),
    sublabel2: t("newsText.sublabel2"),
    introduction: t("newsText.introduction"),
    videotitle: t("newsText.videotitle"),
    videoContentText: t("newsText.videoContentText")
  }

  // 全部新闻列表数据
  const allNewsList = [
    {
      id: 1,
      year: '2023',
      moon: '6.23',
      img: laoshu,
      title: `${t("newsText.sublabel1")}, ${t("newsText.sublabel2")}`,
      text: t("newsText.introduction")
    },
    {
      id: 2,
      year: '2023',
      moon: '6.23',
      img: newsLaoshu2,
      title: t("newsText.newsLaoshu2"),
      text: t("newsText.newsLaoshuText")
    },
    {
      id: 3,
      year: '2023',
      moon: '6.23',
      img: newsXinwentu,
      title: t("newsText.airCleaner"),
      text: t("newsText.airCleanerText")
    },
  ]
  return {
    newsContentText,
    allNewsList
  }
}
export {
  allNews
}