import React from 'react';
import "./title.less";
function RowTitle(props) {
  const { en, cn } = props
  return (
    <h5 styleName='titleComp'>
      <span>{en}</span>
      <span>{cn}</span>
    </h5>
  )
}
function ColumnTitle(props) {
  const { leftText, rightText, style } = props
  return <section styleName="columnTitle" style={{ justifyContent: rightText ? 'space-between' : 'start', ...style }}>
    <div styleName="leftTitle">
      <div styleName="leftTitleEn">{leftText.en}</div>
      <div styleName="leftTitleCn">{leftText.cn}</div>
    </div>
    <div styleName="rightTitle">
      <div styleName="rightTopText">{rightText.top}</div>
      <div styleName="rightBottomText">{rightText.bottom}</div>
    </div>
  </section>
}

export {
  RowTitle,
  ColumnTitle
}