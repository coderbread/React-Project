import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { Form, Icon, Input, Button, message} from 'antd'
import './login.less'

import { reqLogin } from '../api'

import memory from '../utils/memory'
import storage from '../utils/storage'

//the component of Login
class Login extends Component {
  
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { username, password } = values
        reqLogin(username, password)
          .then(response => {
            const result = response.data
            if(result.status === 0){ //登录成功
              const user = result.data
              memory.user = user //保存user到内存中
              storage.saveUser(user) //保存到系统local中
              message.success('log success')
              this.props.history.replace('/')
            } else {//登录失败
              message.error(result.msg)
            }
          })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    if (memory.user._id) {
      return <Redirect to='/' />
    }
    return (
      <div className="login">
        <header className="login-header">
          <img src={require('../assets/img/logo.png')} alt="logo" />
          <span>享读 -后台管理系统</span>
        </header>
        <section className="login-section">
          <h2>欢迎登录</h2>
          <Form className="login-form" onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [
                  { required: true, message: '用户名不能为空！' },
                  // { min: 4, message: '用户名不低于4位' },
                  // { max: 16, message: '用户名不超过16位' },
                  // { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能由数字、字母和下划线组成' }
                ]
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '密码不能为空！' },
                  // { min: 4, message: '密码不低于4位' },
                  // { max: 16, message: '密码不超过16位' },
                  // { pattern: /^[a-zA-Z0-9_]+$/, message: '密码只能由数字、字母和下划线组成' }
                ]
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
              若登录出现问题，请致电868686
            </Form.Item>
          </Form>
        </section>
        <footer className="login-footer">
          <a href="www.baidu.com" style={{ color: 'rgba(0, 0, 0, 0.65)', fontWeight: '500' }}>关于享读</a> | Copyright © 2014-2020 享读  sharead.com 版权所有
        </footer>
      </div>
    )
  }
}

const WrapForm = Form.create()(Login)
export default WrapForm
