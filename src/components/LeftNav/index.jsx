import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import './index.less'
import menuList from '../../config/menuConfig'
//第三方库
import { Menu, Icon } from 'antd'
const { SubMenu } = Menu

function LeftNav(props) {
  const path = props.location.pathname
  const [menuNodes] = useState(function getInitialState() {
    return getMenuNodes_reduce(menuList)
  })
  //根据menuConfig的数据数组生成对应的标签数组
  function getMenuNodes_reduce(menuList) {
    return menuList.reduce((pre, item) => {
      if (item.children) {
        const childItem = item.children.find(childItem => childItem.key === path)
        if (childItem) {
          props.match.openKey = item.key
        }
        pre.push((
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {getMenuNodes_reduce(item.children)}
          </SubMenu>
        ))
      } else {
        pre.push((
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        ))
      }
      return pre
    }, [])
  }

  return (
    <div className="left-nav">
      <Link to='/' className="left-nav-header">
        <img src={require('../../assets/img/logo-white.png')} alt="logo" />
        <h1>拼团后台</h1>
      </Link>
      <div style={{ width: '100%' }}>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[props.match.openKey]}
          mode="inline"
          theme="dark"
        >
          {
            menuNodes
          }
        </Menu>
      </div>
    </div>
  )
}
export default withRouter(LeftNav)

