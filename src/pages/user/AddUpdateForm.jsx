import React, { useEffect } from 'react'
import { Form, Input, Select } from 'antd'
const Item = Form.Item
const Option = Select.Option

function AddUpdateForm(props) {
  const { roles, user, form, setForm} = props
  useEffect(() => {
    setForm(form)
    // eslint-disable-next-line 
  }, [])

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 15 }
  }
  return (
    <Form {...formLayout} >
      <Item label="用户名">
        {
          form.getFieldDecorator('username', {
            initialValue: user.username,
            rules: [
              { required: true, message: '用户名不能为空' }
            ]
          })(<Input placeholder="请输入用户名" />)
        }
      </Item>
      {
        user._id ? null : <Item label="密码">
          {
            form.getFieldDecorator('password', {
              initialValue: '',
              rules: [
                { required: true, message: '密码不能为空' }
              ]
            })(
              <Input placeholder="请输入密码" />
            )
          }
        </Item>
      }
      <Item label="手机号">
        {
          form.getFieldDecorator('phone', {
            initialValue: user.phone,
          })(
            <Input placeholder="手机号分类名称" />
          )
        }
      </Item>
      <Item label="邮箱">
        {
          form.getFieldDecorator('email', {
            initialValue: user.email,
          })(
            <Input placeholder="请输入邮箱名" />
          )
        }
      </Item>
      <Item label="角色">
        {
          form.getFieldDecorator('role_id', {
            initialValue: user.role_id,
          })(
            <Select>
              {roles.map(role => (
                <Option value={role._id} key={role._id}>{role.name}</Option>
              ))}
            </Select>
          )
        }
      </Item>
    </Form>
  )
}

export default Form.create()(AddUpdateForm)
