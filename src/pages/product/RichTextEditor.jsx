import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

function RichTextEditor(props, childRef) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  useEffect(() => {
    const html = props.detail
    const contentBlock = htmlToDraft(html)
    if (contentBlock){
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const _editorState = EditorState.createWithContent(contentState)
      setEditorState(_editorState)
    }
  }, [props])
  useImperativeHandle(childRef, () => ({
    getDetail: () => {//返回输入数据对应的html格式的文本
      return draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }
  }))

  function onchange(editorState) {//监听输入的内容变化，并更新state
    setEditorState(editorState)
  }
  function uploadImageCallBack(file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/manage/img/upload')
      const data = new FormData()
      data.append('image', file)
      xhr.send(data)
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText)
        const url = response.data.url // 得到图片的url
        resolve({ data: { link: url } })
      })
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText)
        reject(error)
      })
    })
  }

  return (
    <Editor
      editorState={editorState}
      editorStyle={{ border: '1px solid black', minHeight: 200, paddingLeft: 10, lineHeight: 1 }}
      onEditorStateChange={onchange}
      toolbar={{
        image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
      }}
    />
  )
}

export default forwardRef(RichTextEditor)
