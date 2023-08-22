// 新闻资讯  内容块1
import React from 'react';
import { allNews } from "./staticResources";
import { useNavigate } from 'react-router-dom';
import { imagesConfig } from "@/i18n/config.js";
import { t } from 'i18next';

import './newsInformation.less';
export default function NewsContext() {
	const navigate = useNavigate();
	const { newsContentText } = allNews();
	const { img: { laoshu } } = imagesConfig()
	return (
		<section styleName='newsContainerContent'>
			<h5 styleName='newsContainerTitle'>
				<span>{newsContentText.titleEn}</span>
				<span>{newsContentText.titleCn}</span>
			</h5>
			<div styleName='newsOneConternt'>
				<aside>
					<h6>{newsContentText.sublabel1}<br />{newsContentText.sublabel2}</h6>
					<article>
						<span>{newsContentText.introduction}</span>
						<div styleName="moreBtn" onClick={() => {
							navigate('/TextPage/Details?type=news&id=1')
						}}>More{t("public.more")} {`>>`}</div>
					</article>
				</aside>
				<figure>
					<img src={laoshu} alt="" />
				</figure>
			</div>
		</section>
	)
}
