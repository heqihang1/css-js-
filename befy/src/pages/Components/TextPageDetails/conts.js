import { imagesConfig } from "@/i18n/config.js";
import { t } from 'i18next';

function newsState() {
  const { img: { huabing, laoshu, newsLaoshu2, newsXinwentu } } = imagesConfig()
  const newsListData = {
    3: {
      title: {
        leftTitle: {
          en: 'News Detail',
          cn: t("newsDetail.newsTitle"),
        },
        rightTitle: {
          top: '2023.7.15',
          bottom: t("newsDetail.source")
        }
      },
      article: {
        title: t("newsDetail.airCleaner"),
        img: newsXinwentu,
        text: [
          t("newsDetail.airCleanerText1"),
          t("newsDetail.airCleanerText2"),
        ]
      }
    },
    1: {
      title: {
        leftTitle: {
          en: 'News Detail',
          cn: t("newsDetail.newsTitle")
        },
        rightTitle: {
          top: '2023.7.17',
          bottom: t("newsDetail.source2")
        }
      },
      article: {
        title: `${t("newsText.sublabel1")}, ${t("newsText.sublabel2")}`,
        img: laoshu,
        text: [
          t("newsDetail.mouseText")
        ]
      }
    },
    2: {
      title: {
        leftTitle: {
          en: 'News Detail',
          cn: t("newsDetail.newsTitle")
        },
        rightTitle: {
          top: '2023.7.16',
          bottom: t("newsDetail.source")
        }
      },
      article: {
        title: t("newsText.newsLaoshu2"),
        img: newsLaoshu2,
        text: [
          t("newsText.mouseText2")
        ]
      }
    },
    4: {
      title: {
        leftTitle: {
          en: 'News Detail',
          cn: t("newsDetail.newsTitle")
        },
        rightTitle: {
          top: '2023.6.20',
          bottom: t("newsDetail.source3")
        }
      },
      article: {
        title: '灭杀效率99.98%！新冠病毒净化器亮相冬奥会',
        img: huabing,
        text: [
          t("newsDetail.airCleanerDetails")
        ]
      }
    }
  }

  const privacyRegulations = [
    {
      title: t("privacyRegulations.title1"),
      text: t("privacyRegulations.text1")
    },
    {
      title: t("privacyRegulations.title2"),
      text: t("privacyRegulations.text2")
    },
    {
      title: t("privacyRegulations.title3"),
      text: t("privacyRegulations.text3")
    },
    {
      title: t("privacyRegulations.title4"),
      text: t("privacyRegulations.text4")
    },
    {
      title: t("privacyRegulations.title5"),
      text: t("privacyRegulations.text5")
    },
    {
      title: t("privacyRegulations.title6"),
      text: t("privacyRegulations.text6")
    },
    {
      title: t("privacyRegulations.title7"),
      text: t("privacyRegulations.text7")
    },
  ]

  return {
    newsListData,
    privacyRegulations
  }
}


export {
  newsState
}
