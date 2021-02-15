import { MainWrapperWithoutFAB } from '../../wrappers/MainWrapper'
import DoubleSideLayout from '../../wrappers/DoubleSideLayout'
import { HalfWidthWrapper } from '../../wrappers/HalfWidthWrapper'
import MarkdownEditor from '../../components/MarkdownEditor'
import MarkdownRenderer from '../../components/MarkdownRenderer'

import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { createPost } from '../../redux/board'
import { uid } from 'uid'

export default function WritePage({ match }) {
  const { category } = match.params
  const history = useHistory()
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [documentText, setDocumentText] = useState('')
  const hashtags = [category]
  const { loginState } = useSelector((state) => {
    return { loginState: state.auth.loginState }
  })

  useEffect(() => {
    if (!loginState) {
      alert('로그인이 필요합니다')
      history.push('/')
    }
  }, [])

  const changeTitle = useCallback(
    (e) => {
      e.preventDefault()
      setTitle(e.target.value)
    },
    [title]
  )

  const submitData = useCallback(() => {
    const postID = uid(24)
    dispatch(createPost(postID, title, documentText, hashtags))
  }, [title, documentText, hashtags])

  return (
    <MainWrapperWithoutFAB>
      <DoubleSideLayout>
        <HalfWidthContainer>
          <input onChange={changeTitle} placeholder="제목을 입력해 주세요" />

          <MarkdownEditor
            bindingText={documentText}
            bindingSetter={setDocumentText}
            width="100%"
          />
        </HalfWidthContainer>
        <HalfWidthContainer>
          <MarkdownRenderer text={documentText} />
          <button onClick={submitData}>작성완료</button>
        </HalfWidthContainer>
      </DoubleSideLayout>
    </MainWrapperWithoutFAB>
  )
}

export const HalfWidthContainer = styled(HalfWidthWrapper)`
  background-color: #ffffff;
  width: 90%;
`
