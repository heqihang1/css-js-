import React from 'react';
import { ColumnTitle as Title } from "../Title/Title";
import "./TextPage.less";

export default function TextPage(props) {
  const { leftTitle, rightTitle, article } = props;


  return (
    <div styleName="articleDetails">
      <Title leftText={leftTitle} rightText={rightTitle} styleName="articleDetailsTitle" style={{ marginBottom: '0.8rem' }} />
      <article>
        {article.title ? <div styleName="articleTitle">{article.title}</div> : null}
        {article.img ? <div styleName="articleImg"><img src={article.img} /></div> : null}
        {article.text ? <div styleName="articleText">{article.text}</div> : null}
      </article>
    </div>
  )
}
