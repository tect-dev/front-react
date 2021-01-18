import React, { useCallback, useEffect, useState } from 'react'
import { uid } from 'uid'
import { useSelector, useDispatch } from 'react-redux'
import { createQuestion } from '../../redux/createPost'
import MarkdownEditorBlock from '../MarkdownEditorBlock'
import MarkdownRenderingBlock from '../MarkdownRenderingBlock'
import { TagBlock } from '../TagBlock'
import { Button } from '../Button'
import styled from 'styled-components'
import { textTooLongAlert } from '../../lib/functions'
import HalfWidthContainer from '../../components/layout/HalfWidthContainer'

export default React.memo(function QuestionWriteSection() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [hashtagText, setHashtagText] = useState('')
  const [hashtagList, setHashtagList] = useState([])

  const splitPoint = /\,/g

  const { userID, userNickname } = useSelector((state) => {
    return {
      userID: state.auth.userID,
      userNickname: state.auth.userNickname,
    }
  })

  const dispatch = useDispatch()

  const onChangeTitle = useCallback(
    (e) => {
      setTitle(textTooLongAlert(e.target.value, 100))
    },
    [title]
  )

  function onChangeContent(value) {
    textTooLongAlert(value, 50000)
    setContent(value)
  }

  useEffect(() => {
    if (hashtagList.length > 10) {
      setHashtagText(hashtagText.substr(0, hashtagText.length - 1))
      hashtagList.pop()
      alert('태그의 갯수가 너무 많아요!')
    }
  }, [hashtagList])

  const onChangeHashtagText = useCallback(
    (e) => {
      setHashtagText(textTooLongAlert(e.target.value, 100))
      let splitedArray = e.target.value.split(splitPoint)
      const editedArray = splitedArray
        .map((element) => {
          return element.replace(/[^가-힣|a-z|A-Z|0-9]/g, '')
        })
        .filter((string) => string.length > 0)

      setHashtagList(editedArray)
    },
    [hashtagText]
  )

  const onSubmitForm = useCallback(
    async (e) => {
      e.preventDefault()
      if (!title || !content) {
        return alert('제목과 본문을 작성해 주세요.')
      }

      const uid24 = uid(24)
      const formData = {
        postID: uid24,
        title: title,
        contentType: 'question',
        content: content,
        authorID: userID,
        authorNickname: userNickname,
        hashtags: hashtagList,
      }

      dispatch(createQuestion(formData))
    },
    [title, content, hashtagList]
  )

  return (
    <>
      <HalfWidthContainer>
        <form onSubmit={onSubmitForm}>
          <div>
            <StyledTitleInput
              type="text"
              id="title"
              value={title}
              maxLength="300"
              onChange={onChangeTitle}
              placeholder="title"
            />
          </div>

          <MarkdownEditorBlock
            contentProps={content}
            onChangeContentProps={onChangeContent}
            height="400px"
            width="41vw"
          />
          <div>
            <StyledTagInput
              type="text"
              id="hashtag"
              value={hashtagText}
              onChange={onChangeHashtagText}
              placeholder="태그는 쉼표로 구분되며, 10개까지 입력 가능합니다"
            />
          </div>
          <div>
            {hashtagList.map((element, index) => {
              return (
                <TagBlock
                  key={index}
                  text={element}
                  function={(e) => {
                    e.preventDefault()
                  }}
                />
              )
            })}
          </div>
          <br />

          <Button className="ask-btn" type="submit" buttonStyle="btn--outline">
            작성 완료
          </Button>
          <br />
        </form>
      </HalfWidthContainer>
      <HalfWidthContainer>
        <PreviewContainer>
          <div>
            <h2>Preview</h2>
            <br />
          </div>
          <MarkdownRenderingBlock content={content} />
        </PreviewContainer>
      </HalfWidthContainer>
    </>
  )
})

const EditorContainer = styled.div``

const PreviewContainer = styled.div`
  display: block;
`

const StyledTitleInput = styled.input`
  height: 60px;
  font-size: 30px;
  font-weight: bold;
  cursor: text;
  border: none;
  outline: none;
  padding: 0.2rem;
  width: 42vw;
`
const StyledTagInput = styled.input`
  height: 60px;
  font-size: 15px;
  cursor: text;
  border: none;
  outline: none;
  padding: 0.2rem;
  width: 42vw;
`
