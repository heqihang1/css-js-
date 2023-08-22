import { imagesConfig } from "@/i18n/config.js";
import { t } from 'i18next';
function contact() {
  const { img: {
    dh,
    wx,
    yx,
    ewm,
    wxgzh,
    xiaohongshu,
    xinlangweibo,
  } } = imagesConfig();
  const constactList = [
    {
      type: 'text',
      list: [

        {
          title: t('contactUs.contact_way'),
          text: '0755-8695-9281',
          icon: dh,
          img: '',
          textStyle: {
            'fontSize': '0.48rem',
            'lineHeight': '0.48rem',
          }
        },
        {
          icon: yx,
          title: t('contactUs.email'),
          text: 'info@baoerfeiyang.cn',
          textStyle: {
            'fontSize': '0.32rem',
            'lineHeight': '0.32rem',
          },
          img: ''
        }
      ]
    },
    {
      type: 'ewm',
      icon: wx,
      title: t('contactUs.contact_person'),
      text: '',
      img: ewm,
      imgStyle: {
        "width": '1.75rem',
        "height": '1.75rem'
      }
    },
  ]
  const ewmList = [
    {
      text: t('contactUs.weChat'),
      img: wxgzh
    },
    {
      text: t('contactUs.xhs'),
      img: xiaohongshu
    },
    {
      text: t('contactUs.wb'),
      img: xinlangweibo
    }
  ]
  return {
    constactList,
    ewmList
  }
}


export {
  contact
}