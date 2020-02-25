import React, { useState, useEffect } from 'react'
import { reqCategory } from '../../api'
import { Card, Icon, List } from 'antd'
const Item = List.Item
export default function Detail(props) {
  const [names, setNames] = useState({ name1: '', name2: '' })
  const { name, desc, price, imgs, detail, pCategoryId, categoryId } = props.location.state

  useEffect(() => {
    getNames()
    // eslint-disable-next-line
  }, [])

  async function getNames(){
    if (pCategoryId === '0') {//一级分类下的商品
      const response = await reqCategory(categoryId)
      setNames({ name1: '', name2: response.data.data.name })
    } else {
      //一次性发送多个请求
      // const response1 = await reqCategory(pCategoryId)
      // const response2 = await reqCategory(categoryId)
      const responses = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      setNames({ name1: responses[0].data.data.name, name2: responses[1].data.data.name })
    }
  }

  const title = (
    <span>
      <Icon
        type='arrow-left'
        style={{ color: '#1890ff', marginRight: 8, fontSize: 18, cursor: 'pointer' }}
        onClick={() => props.history.goBack()} 
      />
      <span>商品详情</span>
    </span>
  )
  return (
    <Card title={title} className='product-detail'>
      <List>
        <Item>
          <span className="left">商品名称:</span>
          <span>{name}</span>
        </Item>
        <Item>
          <span className="left">商品描述:</span>
          <span>{desc}</span>
        </Item>
        <Item>
          <span className="left">商品价格:</span>
          <span>{price}</span>
        </Item>
        <Item>
          <span className="left">所属分类:</span>
          <span>{names.name1} {names.name2 ? ' --> ' + names.name2 : ''}</span>
        </Item>
        <Item>
          <span className="left">商品图片:</span>
          {
            imgs.map(img => (
              <img key={img} src={'http://localhost:5000/upload/' + img} alt={img} />
            ))
          }
        </Item>
        <Item>
          <span className="left">商品详情:</span>
          <span dangerouslySetInnerHTML={{ __html: detail }} />
        </Item>
      </List>
    </Card>
  )
}
