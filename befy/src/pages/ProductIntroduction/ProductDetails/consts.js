import { imagesConfig } from "@/i18n/config.js";
import { t } from 'i18next';
function productDetailsData() {
  const { img: {
    jhqxqy1,
    jhqxqy3,
    jhqxqy2,
    jhqxqy5,
    airpur,
    airpur2,
    airpur3,
    airpur4,
    airpur5,
    airpur6,
    airpur7,
    airpur8,
    kqjhq,
    cyjxqy,
    cyjxqy1,
    cyjxqy2,
    cyjxqy3,
    cyjxqy4,
    chuyuji,
    wasteMachine1,
    wasteMachine2,
    wasteMachine3,
    wasteMachine4,
    wasteMachine5,
    wasteMachine6,
    wasteMachine7,
    xiangxunji,
    xiangxunji1,
    xiangxunji2,
    xiangxunji3,
    xiangxunji4,
    xiangxunji5,
    xiangxunDetails1,
    xiangxunDetails2,
    xiangxunDetails3,
    xiangxunDetails4,
    xiangxunDetails5,
    xiangxunDetails6,
    xiangxunDetails7,
    xiangxunDetails8,
    wzxj,
    wzxj2,
    wzxj1,
    mosquito1,
    mosquito2,
    mosquito3,
    mosquito4,
    mosquito5,
    mosquito6,
    mosquito7,
    mosquito8,
    laoshuxianjing,
    mouse1,
    mouse2,
    mouse3,
    mouse4,
    mouse5,
    mouse6,
    Tmouse1,
    Tmouse2,
    Tmouse3,
    Tmouse4,
    Txingshuerhe,
    Txingshuerhe1,
    Txingshuerhe2,
    Txingshuerhe3,
    Txingshuerhe4,
    Txingshuerhe5,
    Txingshuerhe6,
    zrej,
    zrej2,
    chuzhangerjiao,
    bait1,
    bait2,
    bait3,
    bait4,
    bait5,
    bait6,
    bait7,
    bait8,
    bait9,
    bait10,
    chuyierjiao,
    cyej2,
    cyej3,
    cyej4,
    cyej5,
    cyej6,
    cock1,
    cock2,
    cock3,
    cock4,
    cock5,
    cock6,
    cock7,
    cock8,
    cock9,
    bsq,
    bsqxqy_1,
    bsqxqy_2,
    bsqxqy_3,
    bsqxqy_4,
    bsqxqy_5,
    bsqxqy_6,
    bsqxqy_7,
    bsqxqy_8,
    bsqxqy_9,
    bsqxqy_10,
    bsqxqy_11
  } } = imagesConfig();
  // 净化器
  const airPurifierDetails = {
    imgList: [jhqxqy1, kqjhq, jhqxqy2, jhqxqy5, jhqxqy3,],
    title: t("productDetails.airText1"),
    illustrate: t("product.airText"),
    details: t("productDetails.airText2"),
    price: 2800,
    prices: 4980,
    contentImgList: [
      airpur,
      airpur2,
      airpur3,
      airpur4,
      airpur5,
      airpur6,
      airpur7,
      airpur8
    ]
  }
  // 捕鼠器
  const mousetrap = {
    imgList: [bsqxqy_8, bsq, bsqxqy_11, bsqxqy_9],
    title: t("product.mousetrap"),
    illustrate: t("product.mousetrapText"),
    details: t("productDetails.mousetrap"),
    price: 2380,
    prices: 2580,
    contentImgList: [bsqxqy_1, bsqxqy_2, bsqxqy_3, bsqxqy_4, bsqxqy_5, bsqxqy_6, bsqxqy_7, bsqxqy_8, bsqxqy_9, bsqxqy_10, bsqxqy_11]
  }
  // 厨余机
  const wasteMachine = {
    imgList: [cyjxqy2, chuyuji, cyjxqy4, cyjxqy1, cyjxqy, cyjxqy3],
    title: t('product.nagualep'),
    illustrate: t('product.nagualepText'),
    details: t('productDetails.nagualepIntroduction'),
    price: 3300,
    prices: 4980,
    contentImgList: [wasteMachine1, wasteMachine2, wasteMachine3, wasteMachine4, wasteMachine5, wasteMachine6, wasteMachine7]
  }
  // 精油香薰机
  const aromatherapyMachine = {
    imgList: [xiangxunji1, xiangxunji, xiangxunji2, xiangxunji3, xiangxunji4, xiangxunji5],
    title: t("productDetails.aromatherapyTitle"),
    illustrate: t("productDetails.aromatherapyIllustrate"),
    details: t("productDetails.aromatherapyDetails"),
    price: 9999,
    prices: 9999,
    contentImgList: [xiangxunDetails1, xiangxunDetails2, xiangxunDetails3, xiangxunDetails4, xiangxunDetails5, xiangxunDetails6, xiangxunDetails7, xiangxunDetails8]
  }
  // 蚊子陷阱
  const mosquitoTrap = {
    imgList: [wzxj2, wzxj, wzxj1,],
    title: t("product.mosquito"),
    illustrate: t("product.mosquitoText"),
    details: t("productDetails.mosquitoDetails"),
    price: 450,
    prices: 650,
    contentImgList: [mosquito1, mosquito2, mosquito3, mosquito4, mosquito5, mosquito6, mosquito7, mosquito8]
  }
  // WIFI老鼠陷阱
  const mouseTrap = {
    imgList: [mouse2, laoshuxianjing, mouse3, mouse4, mouse5, mouse6],
    title: t("product.mouseTrap"),
    illustrate: t("product.moustText"),
    details: t("productDetails.mouseTrapDetails"),
    price: 9999,
    prices: 9999,
    contentImgList: [mouse1, mouse2, mouse3, mouse4, mouse5, mouse6]
  }
  // T型鼠饵盒
  const mouseBaitBox = {
    imgList: [Tmouse1, Txingshuerhe, Tmouse2, Tmouse3, Tmouse4],
    title: t("product.mouseBaitBox"),
    illustrate: t("product.mouseBaitBoxText"),
    details: t("productDetails.mouseBaitBox"),
    price: 160,
    prices: 180,
    contentImgList: [Txingshuerhe1, Txingshuerhe2, Txingshuerhe3, Txingshuerhe4, Txingshuerhe5, Txingshuerhe6]
  }
  // ECOGEL易克捷除蟑饵胶10公克
  const cockroachBaitGel = {
    imgList: [zrej, chuzhangerjiao, zrej2],
    title: t("product.termite"),
    illustrate: t("product.termiteText"),
    details: t("productDetails.cockroachBaitGel2"),
    price: 110,
    prices: 149,
    contentImgList: [bait1, bait2, bait3, bait4, bait5, bait6, bait7, bait8, bait9, bait10]
  }
  // ECOGEL易克捷除蚁饵胶 10公克
  const removalGel = {
    imgList: [cock2, chuyierjiao, cyej2, cyej3, cyej4, cyej5, cyej6],
    title: t("product.barrier"),
    illustrate: t("product.termiteText"),
    details: t("productDetails.cockroachBaitGel"),
    price: 110,
    prices: 149,
    contentImgList: [cock1, cock2, cock3, cock4, cock5, cock6, cock7, cock8, cock9]
  }
  return {
    airPurifierDetails,
    mousetrap,
    wasteMachine,
    aromatherapyMachine,
    mosquitoTrap,
    mouseTrap,
    mouseBaitBox,
    cockroachBaitGel,
    removalGel
  }
}

export {
  productDetailsData
}