// 产品介绍
import React, { useState, useEffect } from 'react';
import { imagesConfig } from "@/i18n/config.js";
import { RowTitle } from "../Components/Title/Title";
import ProductList from './ProductList/ProductList';
import Paging from './Paging/Paging';
import { imageList } from "./consts";
import { t } from 'i18next';

import './productIntroduction.less';

const ProductIntroduction = (props) => {
  const { img: { banner } } = imagesConfig()
  const { commoditylist, commoditylist2 } = imageList()
  const [list, setList] = useState(commoditylist)
  const [current, setCurrent] = useState(1)
  useEffect(() => {
    const list = {
      1: commoditylist,
      2: commoditylist2,
    }
    setList(list[current])
  }, [JSON.stringify(commoditylist), JSON.stringify(commoditylist2)])
  return (
    <section styleName='productContainer'>
      <div styleName="productBanner">
        <img src={banner} alt="" />
      </div>
      <div styleName="ProductTitle">
        <RowTitle en={'PRODUCT'} cn={t("header.productTitle")} />
      </div>
      <ProductList list={list} {...props} />
      <Paging style={{ marginBottom: '1.04rem' }} go={() => {
        setList(commoditylist2)
        setCurrent((pre) => {
          return pre + 1
        })
      }} back={() => {
        setCurrent((pre) => {
          return pre - 1
        })
        setList(commoditylist)
      }} />
    </section>
  )
}

export default ProductIntroduction