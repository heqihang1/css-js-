// banner组件
import React, { useState, useContext, useEffect } from "react";

import { imagesConfig } from "@/i18n/config.js";

import { Carousel } from 'antd';

import "./banner.less";

export default function Banner() {
  const { img: { banner1 } } = imagesConfig();
  let list = [
    {
      url: banner1,
      id: 1
    },
    // {
    //   url: banner2,
    //   id: 2
    // }
  ]

  // const { init, dispatch } = useContext(Context)
  return (
    <section styleName="bannerBox">
      <Carousel style={{ height: '100%' }}>
        {
          list.map((v) => {
            return <div key={v.id} style={{ maxWidth: '19.20rem', height: '8rem' }}>
              <img src={v.url} alt="" style={{ width: "100%", height: '8rem' }} />
            </div>
          })
        }
      </Carousel>
      <style>
        {`
          .slick-dots-bottom{
            bottom:50px !important;
          }
          .ant-carousel .slick-dots>li{
            margin-right: 20px;
            position: relative;
            height:60px;
            width: 60px !important;
          }
          .ant-carousel .slick-dots>li button{
            width: 26px;
            height: 26px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform-origin: center;
            transform: rotate(45deg) translate(-50%,-50%);
          }
          .ant-carousel .slick-dots>.slick-active> button {
            width: 40px;
            height: 40px;
          }
          
        `}
      </style>
      {/* <button
        onClick={() => {
          // list = [{

          //   url: banner2,
          //   id: 2

          // }]
          setLanguage('en')
          // dispatch({ type: 'IMAGE_URL', val: 'ss' })
          // console.log(init);

        }}
        style={{ position: 'absolute', zIndex: 1000 }}
      >4648984</button> */}
    </section>
  )
}
