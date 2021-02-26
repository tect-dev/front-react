import { MainWrapperWithoutFAB } from '../../wrappers/MainWrapper'
import DoubleSideLayout from '../../wrappers/DoubleSideLayout'
import { HalfWidthWrapper } from '../../wrappers/HalfWidthWrapper'
import MarkdownEditor from '../../components/MarkdownEditor'
import MarkdownRenderer from '../../components/MarkdownRenderer'
import Loader from 'react-loader-spinner'

import { mediaSize, fontSize } from '../../lib/constants'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { createPost, updatePost } from '../../redux/board'
import { uid } from 'uid'
import { colorPalette } from '../../lib/constants'

export default function WritePage({ match, prevPost }) {
  const { category } = match.params
  const history = useHistory()
  const dispatch = useDispatch()

  const [isEdit, setIsEdit] = useState(prevPost ? true : false)
  const [title, setTitle] = useState(prevPost ? prevPost.postTitle : '')
  const [documentText, setDocumentText] = useState(
    prevPost ? prevPost.postContent : ''
  )
  const hashtags = [category]
  const { loginState } = useSelector((state) => {
    return { loginState: state.auth.loginState }
  })
  const { loading } = useSelector((state) => {
    return { loading: state.board.loading }
  })

  useEffect(() => {
    if (!loginState) {
      alert('로그인이 필요합니다')
      history.push('/')
    }
  }, [])

  const previewRef = useRef()
  useEffect(() => {
    // previewRef.current.scrollTop = previewRef.current.scrollHeight
    // 글 중간을 수정할때도 계속 스크롤이 아래로 꽂히는 버그가 있어서, 일단 각주 처리.
  }, [documentText])

  const changeTitle = useCallback(
    (e) => {
      e.preventDefault()
      setTitle(e.target.value)
    },
    [title]
  )

  const submitData = useCallback(
    (e) => {
      e.preventDefault()
      if (!title || !documentText) {
        return alert('제목과 본문을 작성해 주세요.')
      }
      if (isEdit) {
        const formData = {
          postID: prevPost.postID,
          title: title,
          contentType: 'question',
          content: documentText,
          hashtags: hashtags,
        }
        dispatch(updatePost(formData))
      } else {
        const postID = uid(24)
        dispatch(createPost(postID, title, documentText, hashtags))
      }
    },
    [title, documentText, hashtags]
  )

  return (
    <MainWrapperWithoutFAB>
      <DoubleSideLayout>
        <HalfWidthContainer_for_Renderer>
          <Preview> Preview </Preview>
          <MarkdownRenderer_Container ref={previewRef}>
            <MarkdownRenderer text={documentText} />
          </MarkdownRenderer_Container>
        </HalfWidthContainer_for_Renderer>
        <HalfWidthContainer_new>
          <MarkdownEditor_Container>
            <TitleInput
              value={title}
              onChange={changeTitle}
              placeholder="제목을 입력해 주세요"
            />
            <TitleBottomLine />

            <MarkdownEditor
              bindingText={documentText}
              bindingSetter={setDocumentText}
              width="100%"
            />
          </MarkdownEditor_Container>

          <Hashtags_and_SubmitButton>
            {loading ? (
              <Loader
                type="Grid"
                color={colorPalette.teal5}
                height={20}
                width={20}
              />
            ) : (
              <SubmitButton onClick={submitData}>
                {prevPost ? '수정완료' : '작성완료'}
              </SubmitButton>
            )}
          </Hashtags_and_SubmitButton>
        </HalfWidthContainer_new>
      </DoubleSideLayout>
    </MainWrapperWithoutFAB>
  )
}

export const Preview = styled.div`
  border-radius: 22px;
  background: #fffef8;
  border: 1px solid #6d9b7b;
  font-size: ${fontSize.large};
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #6d9b7b;
  font-weight: bold;
  padding-left: 30px;
  height: 56px;
  margin-bottom: 10px;
`

export const HalfWidthContainer = styled(HalfWidthWrapper)`
  background-color: #ffffff;
  width: 100%;
`
export const HalfWidthContainer_new = styled.div`
  height: 70vh;
  width: 100%;
`

export const HalfWidthContainer_for_Renderer = styled(HalfWidthContainer_new)`
  ${mediaSize.small} {
    display: none;
  }
`

export const MarkdownRenderer_Container = styled.div`
  overflow: scroll;
  height: 584px;
  border-radius: 22px;
  background: #fffef8;
  border: 1px solid #6d9b7b;
  padding: 20px;
  height: 70vh;
`

const MarkdownEditor_Container = styled.div`
  border-radius: 22px;
  background: #fffef8;
  border: 1px solid #6d9b7b;
  box-sizing: border-box;
  padding: 10px;
`

const TitleInput = styled.input`
  all: unset;
  font-weight: bold;
  color: #6d9b7b;
  padding: 10px 0 20px 10px;
  font-size: ${fontSize.large};
  &::placeholder {
    color: #6d9b7b;
  }
`

const TitleBottomLine = styled.div`
  width: 174.5px;
  height: 3px;
  margin-left: 10px;
  margin-bottom: 14px;
  background: #6d9b7b;
  border-radius: 1.5px;
`

const SubmitButton = styled.button`
  cursor: pointer;
  font-size: ${fontSize.medium};
  padding: 8px 17px 7px 22px;
  background: #6d9b7b;
  border-radius: 10px;
  border: none;
  color: white;
  font-weight: bold;
`

const Hashtags_and_SubmitButton = styled.div`
  margin-top: 84px;
  display: flex;
  flex-direction: row-reverse;
`
