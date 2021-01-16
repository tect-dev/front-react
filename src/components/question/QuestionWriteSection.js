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
    <div>
      <HalfWidthContainer>
        <EditorContainer>
          <form onSubmit={onSubmitForm}>
            <div>
              <label htmlFor="title">
                <h3>제목</h3>
              </label>

              <input
                type="text"
                id="title"
                value={title}
                maxLength="300"
                onChange={onChangeTitle}
              />
            </div>
            <h3>본문</h3>

            <MarkdownEditorBlock
              contentProps={content}
              onChangeContentProps={onChangeContent}
              height="400px"
            />
            <div>
              <label htmlFor="hashtag">
                <h3>Tags</h3>
                태그는 쉼표로 구분되며, 10개까지 입력 가능합니다{' '}
              </label>
              <div>
                <input
                  type="text"
                  id="hashtag"
                  value={hashtagText}
                  onChange={onChangeHashtagText}
                />
              </div>
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
            <div className="button">
              <Button
                className="ask-btn"
                type="submit"
                buttonStyle="btn--outline"
              >
                작성 완료
              </Button>
            </div>
          </form>
        </EditorContainer>
      </HalfWidthContainer>
      <HalfWidthContainer>
        <PreviewContainer>
          <div>
            <h2>Preview</h2>
          </div>
          <MarkdownRenderingBlock content={content} />
        </PreviewContainer>
      </HalfWidthContainer>
    </div>
  )
})

const EditorContainer = styled.div`
  display: block;
`

const PreviewContainer = styled.div`
  display: block;
`
