import React from 'react'
import './index.less'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'
const { SubMenu } = Menu

export default function LeftNav() {
  return (
    <div className="left-nav">
      <Link to='/' className="left-nav-header">
        <img src={require('../../assets/img/logo-white.png')} alt="logo" />
        <h1>拼团后台</h1>
      </Link>
      <div style={{ width: '100%' }}>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
        >
          <Menu.Item key="1">
            <Icon type="pie-chart" />
            <span>首页</span>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="mail" />
                <span>商品</span>
              </span>
            }
          >
            <Menu.Item key="1">
              <Icon type="mail" />
              <span>品类管理</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="mail" />
              <span>商品管理</span>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="2">
            <Icon type="pie-chart" />
            <span>用户</span>
          </Menu.Item>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="appstore" />
                <span>数据图</span>
              </span>
            }
          >
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </SubMenu>
        </Menu>
      </div>
    </div>
  )
}

