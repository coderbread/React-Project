import React, { Component } from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
//侧边栏和顶部栏
import LeftNav from '../components/LeftNav'
import Header from '../components/Header'
//component in content
import Begin from './begin';
import Product from './product'
import Category from './category'
import Role from './role'
import User from './user'
import { Bar, Line, Pie } from './charts'
//内存中值
import memory from '../utils/memory'
//第三方库
import { Layout } from 'antd'

const { Footer, Sider, Content } = Layout

//the component of Home
export default class Home extends Component {
  render() {
    const user = memory.user
    if (!user._id) {
      return <Redirect to='/login' />
    }
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header />
          <Content style={{ margin: 16, backgroundColor: '#fff' }}>
            <Switch>
              <Route path='/begin' component={Begin} />
              <Route path='/category' component={Category} />
              <Route path='/product' component={Product} />
              <Route path='/user' component={User} />
              <Route path='/role' component={Role} />
              <Route path="/charts/bar" component={Bar} />
              <Route path="/charts/pie" component={Pie} />
              <Route path="/charts/line" component={Line} />
              <Redirect to='/begin' />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center', color: '#ccc' }}>推荐使用谷歌浏览器，以获得更好的使用体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
