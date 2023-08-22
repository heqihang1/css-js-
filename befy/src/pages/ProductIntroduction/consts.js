
import { imagesConfig } from "@/i18n/config.js";
import { t } from 'i18next';

function imageList() {
  const { img: { bsq,
    chuyierjiao,
    chuzhangerjiao,
    Txingshuerhe,
    xiangxunji,
    kqjhq,
    wenzixianjing,
    laoshuxianjing,
    chuyuji } } = imagesConfig()
  const commoditylist = [
    // {
    //   img: bsq,
    //   title: t('product.jjbsq'),
    //   text: t('product.jjbsqText'),
    //   id: '1',
    //   bolNew: true,
    //   type: 'mousetrap'
    // },
    {
      img: kqjhq,
      title: t("product.airCleaner"),
      text: t("product.airText"),
      id: '2',
      bolNew: true,
      type: 'airPurifier'
    },
    {
      img: chuyuji,
      title: t('product.nagualep'),
      text: t('product.nagualepText'),
      id: '3',
      bolNew: true,
      type: 'wasteDetails'
    },
    {
      img: xiangxunji,
      title: t('product.aromatherapy'),
      text: t('product.aromatherapyText'),
      id: '7',
      bolNew: true,
      type: 'aromatherapy'
    }, {
      img: wenzixianjing,
      title: t('product.mosquito'),
      text: t('product.mosquitoText'),
      id: '8',
      bolNew: false,
      type: 'mosquitoTrap'
    },
    {
      img: laoshuxianjing,
      title: t('product.mouseTrap'),
      text: t('product.moustText'),
      id: '9',
      bolNew: false,
      type: 'mouseTrap'
    },
    {
      img: chuyierjiao,
      title: t('product.termite'),
      text: t('product.termiteText'),
      id: '77',
      bolNew: false,
      type: 'removalGel',
    },
  ]

  const commoditylist2 = [
    {
      img: chuzhangerjiao,
      title: t('product.barrier'),
      text: t('product.termiteText'),
      id: '77',
      bolNew: false,
      type: 'cockroachBaitGel'
    },
    {
      img: Txingshuerhe,
      title: t('product.mouseBaitBox'),
      text: t('product.mouseBaitBoxText'),
      id: '7',
      bolNew: false,
      type: 'mouseBaitBox'
    },
  ]
  return {
    commoditylist,
    commoditylist2
  }
}


export {
  imageList
}

