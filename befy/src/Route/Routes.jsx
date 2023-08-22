import React from 'react'
// 首页
import Home from "../pages/home";
// 新闻
import NewsInformation from "../pages/NewsInformation";
// 产品介绍
import ProductIntroduction from "../pages/ProductIntroduction";
// 公司简介
import CompanyProfile from "../pages/CompanyProfile";
// 关于我们
import ContactUs from "../pages/ContactUs";
// 空气进化器
import ProductDetails from "../pages/ProductIntroduction/ProductDetails/ProductDetails";
// 新闻详情
import TextDetails from "../pages/Components/TextPageDetails/TextPageDetails";
// import Mousetrap from "../pages/NewsInformation"
const routesList = [
  {
    url: '/Home',
    key: 'Home',
    element: <Home />
  },
  {
    url: '/NewsInformation',
    key: 'NewsInformation',
    element: <NewsInformation />
  },
  {
    url: '/ProductIntroduction',
    key: 'ProductIntroduction',
    element: <ProductIntroduction />
  },
  {
    url: '/CompanyProfile',
    key: 'CompanyProfile',
    element: <CompanyProfile />
  },
  {
    url: '/ContactUs',
    key: 'ContactUs',
    element: <ContactUs />
  },
  {
    url: '/ProductIntroduction/ProductDetails',
    key: 'ProductDetails',
    element: <ProductDetails />
  },
  // {
  //   url: '/ProductIntroduction/Mousetrap',
  //   key: 'Mousetrap',
  //   element: <Mousetrap />
  // },
  {
    url: '/TextPage/Details',
    key: 'TextPage',
    element: <TextDetails />
  }
]
export default routesList;