import React, { Component } from 'react'
import './index.less'
import { Icon } from 'antd'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1637136_ciq0whtmh1m.js',
})
export default class Header extends Component {
  render() {
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎你，admin</span>
          |
          <IconFont className="tuichu-icon" type="admintuichufffpx" />
          <a href="">退出</a>
        </div>
        <div className="header-bottom">
          <div className="left">首页</div>
          <div className="right">
            <span>2019 2.2.2</span>
            <img src={require('../../assets/img/logo.png')} alt="天气信息"/>
            <span>晴</span>
          </div>
        </div>
      </div>
    )
  }
}


