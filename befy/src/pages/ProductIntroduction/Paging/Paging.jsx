import React, { useState } from 'react';
import { t } from 'i18next';
import "./paging.less";

/**
 * 
 * @param {*} props 
 * back function
 * go function
 * style
 * @returns 
 */
export default function Paging(props) {
  const [itemList, setitemList] = useState({
    current: 1,
    pagenumber: 2
  })
  return (
    <section styleName="paging" style={props.style}>
      <div styleName="pagingText"
        style={{
          color: itemList.current < itemList.pagenumber ? '#999' : '#39b54a'
        }}
        onClick={() => {
          // window.scrollTo(0, 0)
          setitemList((pre) => {
            return {
              ...pre,
              current: pre.current - 1
            }
          })
          props.back()
        }}>{t("public.previousPage")}</div>
      <div style={{ padding: '0 0.48rem' }}>
        {itemList.current} / {itemList.pagenumber}
      </div>
      <div styleName="pagingText"
        style={{
          color: itemList.current < itemList.pagenumber ? '#39b54a' : '#999'
        }}
        onClick={() => {
          setitemList((pre) => {
            return {
              ...pre,
              current: pre.current + 1
            }
          })
          // window.scrollTo(0, 0)
          props.go()
        }} >{t("public.nextPage")}</div>
    </section>
  )
}
