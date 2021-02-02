import React, { useCallback, useEffect, useState } from 'react'
import { uid } from 'uid'
import { useInput } from '../../hooks/hooks'
import { useSelector, useDispatch } from 'react-redux'
import { updateQuestion } from '../../redux/updatePost'
import MarkdownEditorBlock from '../MarkdownEditorBlock'
import MarkdownRenderingBlock from '../MarkdownRenderingBlock'
import { TagBlock } from '../TagBlock'
import { Button } from '../Button'
import styled from 'styled-components'
import { textTooLongAlert } from '../../lib/functions'
import HalfWidthContainer from '../../components/layout/HalfWidthContainer'

export default React.memo(function QuestionEditSection({ initialData }) {
  const [title, onChangeTitle] = useInput(initialData.question.title)
  const [content, setContent] = useState(initialData.question.content)
  const [hashtagText, setHashtagText] = useState(
    mergeArray(initialData.question.hashtags, `\,`)
  )
  const [hashtagList, setHashtagList] = useState(initialData.question.hashtags)
  const questionID = initialData.question._id || 'error'
  const splitPoint = /\,/g

  function mergeArray(array, splitter) {
    let mergedOne = ''
    for (const element of array) {
      mergedOne = mergedOne + element + splitter
    }
    return mergedOne
  }

  const { userID, displayName } = useSelector((state) => {
    return {
      userID: state.auth.userID,
      displayName: state.auth.displayName,
    }
  }) || {
    userID: '123456789012345678901234',
    displayName: '익명',
  }

  const dispatch = useDispatch()

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
  }, [hashtagList, hashtagText])

  const onChangeHashtagText = useCallback(
    (e) => {
      setHashtagText(e.target.value)
      let splitedArray = e.target.value.split(splitPoint)
      const editedArray = splitedArray
        .map((element) => {
          return element.replace(/[^가-힣|a-z|A-Z|0-9]/g, '')
        })
        .filter((string) => string.length > 0)

      setHashtagList(editedArray)
    },
    [hashtagText, splitPoint]
  )

  const onSubmitForm = useCallback(
    async (e) => {
      e.preventDefault()
      if (!title || !content) {
        return alert('제목과 본문을 작성해 주세요.')
      }

      const formData = {
        postID: questionID,
        title: title,
        contentType: 'question',
        content: content,
        authorID: userID,
        authorNickname: displayName,
        hashtags: hashtagList,
      }

      dispatch(updateQuestion(formData))
    },
    [title, content, hashtagList, dispatch, questionID, userID, displayName]
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
