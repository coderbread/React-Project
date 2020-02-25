import React, { useState, useEffect } from 'react'
import AddUpdateForm from './AddUpdateForm'
import { reqUserList, reqAddOrUpdateUser, reqDeleteUser } from '../../api'
import dataFormat from '../../utils/dateFormat'
import { Card, Button, Table, Modal, message } from 'antd'

export default function User() {
  const [userList, setUserList] = useState([])
  const [roles, setRoles] = useState([])
  const [visibleStatus, setVisibleStatus] = useState(0)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form, setForm] = useState({})
  const [childUser, setChildUser] = useState({})

  useEffect(() => {
    getUserList()
  }, [])

  async function getUserList() {
    const response = await reqUserList()
    console.log('userList ', response.data)
    if (response.data.status === 0) {
      setUserList(response.data.data.users)
      setRoles(response.data.data.roles)
    }
  }
  function showAddForm(){
    setChildUser({})
    setVisibleStatus(1)
  }
  function showUpdateForm(user) {
    setChildUser(user)
    setVisibleStatus(1)
  }
  function handleCancel(){
    setVisibleStatus(0)
    form.resetFields()
  }
  async function addOrUpdateUser(){
    setConfirmLoading(true)
    const user = form.getFieldsValue()
    if (childUser._id) {
      user._id = childUser._id
    }
    const response = await reqAddOrUpdateUser(user)
    form.resetFields()
    if (response.data.status === 0) {
      setConfirmLoading(false)
      getUserList()
      handleCancel()
      message.success((childUser._id ? '更新' : '添加') + '用户成功')
    } else {
      message.error((childUser._id ? '更新' : '添加') + '用户失败')
    }
  }
  function showDeleteForm(user) {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      onOk: async () => {
        const response = await reqDeleteUser(user._id)
        if (response.data.status === 0) {
          message.success('删除用户成功!')
          getUserList()
        }
      }
    })
  }

  const title = (
    <Button type="primary" onClick={showAddForm}>创建用户</Button>
  )
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '电话',
      dataIndex: 'phone'
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      render: (create_time) => (
        <span>{dataFormat('yyyy-MM-dd - hh:mm', new Date(create_time))}</span>
      )
    },
    {
      title: '所属角色',
      dataIndex: 'role_id',
      render: (role_id) => {
        const _roles = roles.filter(role => role._id === role_id)//获取用户匹配的role对象
        if (_roles.length === 1) {
          return _roles[0].name
        }
      }
    },
    {
      title: '操作',
      render: (user) => (
        <div>
          <Button
            ghost
            type="primary"
            onClick={() => { showUpdateForm(user) }}
          >
            修改
          </Button>
          &nbsp;&nbsp;
          <Button
            ghost
            type="primary"
            onClick={() => { showDeleteForm(user) }}
          >
            删除
          </Button>
        </div>
      )
    }
  ]
  return (
    <Card title={title}>
      <Table
        rowKey="_id"
        bordered
        dataSource={userList}
        columns={columns}
        pagination={{ defaultPageSize: 5, showQuickJumper: true }}
      />
      <Modal
        title="添加用户"
        visible={visibleStatus === 1}
        onOk={addOrUpdateUser}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <AddUpdateForm user={childUser} roles={roles} setForm={(form) => setForm(form)}/>
      </Modal>
    </Card>
  )
}
