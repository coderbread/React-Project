import React, { useState, useEffect, useRef } from 'react'
import RichTextEditor from './RichTextEditor'
import { Card, Form, Input, Cascader, Upload, Modal, Button, Icon, message } from 'antd'
import { reqCategories, reqDeleteImg, reqAddOrUpdateProduct } from '../../api'
const Item = Form.Item
const { TextArea } = Input
const IMG_URL = 'http://localhost:5000/upload/'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function AddUpdata(props) {
  const [options, setOptions] = useState([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState([])
  const product = props.location.state || {}
  const ids = []
  if (product) {
    const { pCategoryId, categoryId } = product
    if (pCategoryId === 0) {
      ids.push(categoryId)
    } else {
      ids.push(pCategoryId)
      ids.push(categoryId)
    }
  }
  const childRef = useRef()

  useEffect(() => {
    initOptions()
    // eslint-disable-next-line
  }, [])

  async function initOptions() {//初始化级联选项 和图片
    const categories = await getCategories('0')
    const options = categories.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false
    }))
    //获取响应的二级分类列表 并进行级联匹配
    if (product) {
      const { pCategoryId, imgs } = product
      const subCategories = await getCategories(pCategoryId)
      const childOptions = subCategories.map(c => ({
          value: c._id,
          label: c.name,
          isLeaf: true
        }))
        const targetOption = options.find(option => option.value === pCategoryId)
        if (targetOption) {
          targetOption.children = childOptions
        }
      //顺带把图片传进来
      if(imgs){
        const _fileList = imgs.map((img, index) => ({
          uid: -index,
          name: img,
          status: 'done',
          url: IMG_URL + img
        }))
        setFileList(_fileList)
      }
    }
    setOptions(options)
  }
  function validator(rule, value, callback) {//商品价格大于零的验证函数
    if (value * 1 > 0) {
      callback()
    } else {
      callback('商品价格不能小于0')
    }
  }
  async function getCategories(parentId) {//获取分类列表的函数
    const response = await reqCategories(parentId)
    if (response.data.status === 0) {
      const categories = response.data.data
      return categories
    }
  }
  async function loadData(selectedOptions) {//用于加载下一级级联列表的函数
    const targetOption = selectedOptions[0] || {}
    targetOption.loading = true
    //根据选中的分类，加载二级分类列表
    const subCategories = await getCategories(targetOption.value)
    targetOption.loading = false
    if (subCategories && subCategories.length > 0) {
      targetOption.children = subCategories.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
    } else {
      targetOption.isLeaf = true
    }
    setOptions([...options])
  }
  function handleCancel() {
    setPreviewVisible(false)
  }
  async function handlePreview(file) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    console.log()
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
  }
  async function handleChange({ file, fileList }) {
    if (file.status === 'done') {
      const result = file.response
      if (result.status === 0) {
        message.success('图片上传成功')
        const { name, url } = result.data
        fileList[fileList.length - 1].name = name
        fileList[fileList.length - 1].url = url
      } else {
        message.error('图片上传失败')
      }
    } else if (file.status === 'removed') {
      const response = await reqDeleteImg(file.name)
      if (response.data.status === 0) {
        message.success('图片删除成功')
      }
    }
    //更新状态
    setFileList(fileList)
  }
  function submit() {//提交函数
    props.form.validateFields(async (error, values) => {
      if (!error) {
        const { name, desc, price, ids } = values
        const pCategoryId = ids === 0 ? '0' : ids[0]
        const categoryId = ids === 0 ? ids[0] : ids[1]
        const detail = childRef.current.getDetail()
        const imgs = fileList.map(file => file.name)
        const product = { name, desc, price, pCategoryId, categoryId, detail, imgs }
        const result = await reqAddOrUpdateProduct(product)
        if (result.data.status === 0) {
          message.success('商品操作成功')
          props.history.goBack()
        } else {
          message.error('商品操作失败')
        }
      }
    })
  }

  const title = (
    <span>
      <Icon type="arrow-left" style={{ color: '#1890ff', marginRight: 8, fontSize: 18, cursor: 'pointer' }} onClick={() => props.history.goBack()} />
      添加商品
    </span>
  )
  const formItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 8 }
  }
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text" style={{ fontSize: 12 }}>点击上传图片</div>
    </div>
  )
  const { getFieldDecorator } = props.form
  return (
    <Card title={title}>
      <Form {...formItemLayout}>
        <Item label="商品名称">
          {getFieldDecorator('name', {
            initialValue: product.name,
            rules: [
              { required: true, message: '商品名称不能为空' }
            ]
          })(<Input placeholder="请输入商品名称" />)}
        </Item>
        <Item label="商品描述">
          {getFieldDecorator('desc', {
            initialValue: product.desc,
            rules: [
              { required: true, message: '商品描述不能为空' }
            ]
          })(<TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }}></TextArea>)}
        </Item>
        <Item label="商品价格">
          {getFieldDecorator('price', {
            initialValue: product.price,
            rules: [
              { required: true, message: '商品价格不能为空' },
              { validator }
            ]
          })(<Input type="number" placeholder="请输入商品价格" addonAfter="元" />)}
        </Item>
        <Item label="商品分类">
          {getFieldDecorator('ids', {
            initialValue: ids,
            rules: [{ required: true, message: '商品分类不能为空' }]
          })(
            <Cascader
              options={options}
              loadData={loadData}
            />)}
        </Item>
        <Item label="商品图片">
          <Upload
            action="/manage/img/upload"
            name="image"
            accept="image/*"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 4 ? null : uploadButton}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Item>
        <Item label="商品详情" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
          <RichTextEditor ref={childRef} detail={product.detail || ''} />
        </Item>
        <Item style={{ float: 'left' }}>
          <Button type="primary" >重置</Button>
        </Item>
        <Item style={{ float: 'right', marginRight: 20 }}>
          <Button type="primary" onClick={submit} >提交</Button>
        </Item>
      </Form>
    </Card>
  )
}

export default Form.create()(AddUpdata)
