//净化器详情页
import React from 'react';
import { useLocation } from 'react-router-dom';
import CommodityInfo from "../../Components/CommodityInfo/CommodityInfo";
import {
  productDetailsData
} from "./consts";
import "./ProductDetails.less";
import { locationParams } from "../../../common";


export default function ProductDetails(props) {
  const locationType = locationParams()
  const { airPurifierDetails, wasteMachine, aromatherapyMachine, mosquitoTrap,
    mouseTrap,
    mouseBaitBox,
    cockroachBaitGel,
    removalGel,
    mousetrap } = productDetailsData()

  const pageDetails = {
    airPurifier: airPurifierDetails,
    wasteDetails: wasteMachine,
    aromatherapy: aromatherapyMachine,
    mosquitoTrap,
    mouseTrap,
    mouseBaitBox,
    cockroachBaitGel,
    removalGel,
    mousetrap
  }
  const { contentImgList } = pageDetails[locationType?.type];
  return (
    <div style={{ width: '100%' }} styleName="ProductDetails">
      <CommodityInfo {...pageDetails[locationType?.type]} />
      <section styleName="ProductDetailsContainer">
        {contentImgList.map((v, i) => {
          return <img src={v} key={i} />
        })}
      </section>
    </div>
  )
}