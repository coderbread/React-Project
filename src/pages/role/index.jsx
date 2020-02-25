import React, { useState, useEffect } from 'react'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import dataFormat from '../../utils/dateFormat'
import menuConfig from '../../config/menuConfig'
import memory from '../../utils/memory'
import { Card, Button, Table, Modal, Form, Input, message, Tree } from 'antd'
const Item = Form.Item
const { TreeNode } = Tree

function Role(props) {
  const [roles, setRoles] = useState([])//所有角色
  const [role, setRole] = useState({})//当前选中的角色
  const [treeNodes, setTreeNodes] = useState([])
  const [columns, setColumns] = useState([])
  const [visibleStatus, setVisibleStatus] = useState(0)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [checkKeys, setCheckKeys] = useState([])

  useEffect(() => {
    console.log(memory);
    initColumns()
    getRoles()
    setTreeNodes(getTreeNodes(menuConfig))
    //eslint-disable-next-line
  }, [])
  useEffect(() => {
    setCheckKeys(role.menus)
  }, [role])

  function initColumns() {//初始化columns的函数
    const _columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => (
          <span>{dataFormat('yyyy-MM-dd - hh:mm', new Date(create_time))}</span>
        )
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: (auth_time) => auth_time ? (
          <span>{dataFormat('yyyy-MM-dd - hh:mm', new Date(auth_time))}</span>
        ) : ''
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      }
    ]
    setColumns(_columns)
  }
  async function getRoles() {//获取角色列表
    const response = await reqRoles()
    if (response.data.status === 0) {
      setRoles(response.data.data)
    }
  }
  function onRow(role) {//表格的 行 事件
    return {
      onClick: () => {
        setRole(role)
      }
    }
  }
  function addRole() {//添加角色 点击'ok'触发
    setConfirmLoading(true)
    props.form.validateFields(async (err, values) => {
      if (!err) {
        const { roleName } = values
        // props.form.resetFields()//清除掉input里的默认值
        const response = await reqAddRole(roleName)
        setConfirmLoading(false)
        //清除掉input里的默认值
        props.form.resetFields()
        if (response.data.status === 0) {
          getRoles()
          setVisibleStatus(0)
          message.success('添加成功')
        }
      }
    })
  }
  function getTreeNodes(menuConfig) {//获取树形菜单列表 点击‘设置权限’触发
    return menuConfig.reduce(((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre
    }), [])
  }
  function onCheck(checkKeys){
    setCheckKeys(checkKeys)
  }
  async function updateRole() {//更新角色权限 点击‘ok’触发
    role.menus = checkKeys
    role.auth_name = Date.now()
    role.auth_name = memory.user.username
    const response = await reqUpdateRole(role)
    if (response.data.status === 0){
      message.success('设置成功')
    }
    handleCancel()
    getRoles()
  }
  function handleCancel() {//隐藏模态框
    setCheckKeys(role.menus)
    setVisibleStatus(0)
  }

  const title = (
    <span>
      <Button type="primary" onClick={() => setVisibleStatus(1)}>创建角色</Button> &nbsp;&nbsp;
      <Button type="primary" disabled={!role._id} onClick={() => setVisibleStatus(2)}>设置权限</Button>
    </span>
  )
  const layoutForItem = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 }
  }

  return (
    <Card title={title}>
      <Table
        rowKey="_id"
        bordered
        dataSource={roles}
        columns={columns}
        onRow={onRow}
        rowSelection={{ type: 'radio', selectedRowKeys: [role._id], onSelect: role => setRole(role) }}
        pagination={{ defaultPageSize: 5, showQuickJumper: true }}
      />
      <Modal
        title="添加角色"
        visible={visibleStatus === 1}
        onOk={addRole}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form>
          <Item label="角色名称" {...layoutForItem} >
            {
              props.form.getFieldDecorator('roleName', {
                initialValue: '',
                rules: [
                  { required: true, message: '角色名不能为空' }
                ]
              })(
                <Input placeholder="请输入角色名称" />
              )
            }
          </Item>
        </Form>
      </Modal>
      <Modal
        title="设置权限"
        visible={visibleStatus === 2}
        onOk={updateRole}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form>
          <Item label="角色名称" {...layoutForItem} >
            <Input value={role.name} disabled />
          </Item>
        </Form>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkKeys}
          onCheck={onCheck}
        >
          <TreeNode title="所有权限" key="all">
            {treeNodes}
          </TreeNode>
        </Tree>
      </Modal>
    </Card>
  )
}

export default Form.create()(Role)
