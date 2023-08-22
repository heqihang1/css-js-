import React, { useCallback, useEffect, useRef, useState } from 'react';
import { imagesConfig } from '@/i18n/config';
import { t } from 'i18next';
import "./commodityInfo.less";


export default function CommodityInfo(props) {
  const { imgList, title, illustrate, details, price, prices } = props;
  const { img: { lefts,
    right,
    dy,
    tt,
    wb,
    fotwx,
    xhs,
    HighLeft,
    HighRght, } } = imagesConfig()
  const shareList = [
    {
      type: 'text',
      text: t("footer.share")
    },
    {
      type: 'img',
      img: fotwx
    },
    {
      type: 'img',
      img: dy
    },
    {
      type: 'img',
      img: xhs
    },
    {
      type: 'img',
      img: tt
    },
    {
      type: 'img',
      img: wb
    },
  ]
  const [highImg, setHighImg] = useState(1);
  const [move, setMove] = useState({
    x: 0,
    y: 0,
  })
  const [left, setLeft] = useState(0);
  const boolRef = useRef(false)
  const lsitRef = useRef();
  const higItemRef = useRef();
  const listBoxRef = useRef();
  const imgRef = useRef() // 图片
  const hiGImgRef = useRef() // 大图片
  // 点击切换按钮
  const onMoveRightLeft = useCallback((val) => {
    const itemWidth = higItemRef.current.offsetWidth; // 最大的单个的宽度
    const listWidth = lsitRef.current.offsetWidth; // 盒子的宽度
    const listLeft = lsitRef.current.offsetLeft; // left值
    const listBoxWidth = listBoxRef.current.offsetWidth; // 展示的盒子的宽度
    const countNum = (listWidth - itemWidth) / (imgList.length - 1) // 一个小盒子的宽度
    if (val && (Math.abs(listLeft) + listBoxWidth + 5) < listWidth && imgList.length > 3) {
      setLeft((pre) => {
        return pre - Math.floor(countNum)
      })
    }
    if (!val) {
      setLeft((pre) => {
        return pre + Math.floor(countNum)
      })
    }
  }, [lsitRef, higItemRef])

  // 注册mover事件
  const onRegisterMove = () => {
    imgRef.current.addEventListener("mousemove", (e) => {
      const width = imgRef.current.offsetWidth;
      const height = imgRef.current.offsetHeight;
      if (!boolRef.current) {
        boolRef.current = true
      }
      setMove({
        x: -((e.offsetX + 10) / width) * 100,
        y: -((e.offsetY + 10) / height) * 100,
      })
    });
    imgRef.current.addEventListener("mouseout", (e) => {
      if (boolRef.current) {
        boolRef.current = false
      }
      setMove({
        x: 0,
        y: 0,
      })
    });
  }

  useEffect(() => {
    if (imgRef.current) {
      onRegisterMove()
    }
  }, [imgRef.current])
  return (
    <div styleName="commodityInfo">
      <section styleName="commodityInfoLeft">
        {/* 主图片 */}
        <div styleName="hostImg" ref={imgRef}>
          <img src={imgList[highImg]} alt=""

            style={{
              zIndex: 1,
              opacity: !boolRef.current ? '1' : '0'
              // opacity: 0,
              // display: !boolRef.current ? 'block' : 'none' 
            }}
          />
          <img src={imgList[highImg]} alt="" ref={hiGImgRef} styleName="HigImgBox"
            style={{
              left: move.x + '%',
              top: move.y + '%',
              opacity: boolRef.current ? '1' : '0'
              // display: boolRef.current ? 'block' : 'none'
            }}
          />
        </div>
        {/* 图片列表 */}
        <div styleName="imgList">
          <figure
            onClick={() => {
              if (highImg > 0) {
                setHighImg(highImg - 1)
              }
              if (left < 0) {
                onMoveRightLeft(false)
              }
            }}
          >
            {highImg > 0 ? <img src={HighLeft} alt="" /> : <img src={lefts} alt="" />}

          </figure>
          <div styleName="infoImgList" ref={listBoxRef}>
            <div styleName="imgLists" ref={lsitRef} style={{ left: left }}>
              {
                imgList.map((v, i) => {
                  return <div styleName="infoImgListItem" key={i}
                    ref={i === highImg ? higItemRef : null}
                    onClick={() => {
                      setHighImg(i)
                    }}
                    style={highImg === i ? { width: '2.32rem', height: '2.26rem' } : {}}>
                    <img src={v} alt="" />
                  </div>
                })
              }
            </div>
          </div>
          <figure
            onClick={() => {
              if (highImg < (imgList.length - 1)) {
                setHighImg(highImg + 1)
              }
              onMoveRightLeft(true)
            }}
          >
            {highImg < (imgList.length - 1) ? <img src={HighRght} alt="" /> : <img src={right} alt="" />}

          </figure>

        </div>
      </section>
      <aside styleName="commodityInfoRight">
        <div styleName="commodityInfoTitle">{title}</div>
        <span styleName="illustrate">{illustrate}</span>
        <div styleName="detailsInfo">{details}</div>
        <div styleName="priceInfo">
          <span>¥</span>
          <span>{price}</span>
          <span>{prices}</span>
        </div>
        <div styleName="shareList">
          {shareList.map((v, i) => {
            return v.type === "text" ? <span key={i}>{v.text}</span> : <img src={v.img} key={i} />
          })}
        </div>
      </aside>
    </div>
  )
}
