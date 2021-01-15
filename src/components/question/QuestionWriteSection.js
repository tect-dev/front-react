import React, { useCallback, useEffect, useState } from 'react'
import { uid } from 'uid'
import { useInput } from '../../hooks/hooks'
import { useSelector, useDispatch } from 'react-redux'
import { createQuestion } from '../../redux/createPost'
import MarkdownEditorBlock from '../MarkdownEditorBlock'
import MarkdownRenderingBlock from '../MarkdownRenderingBlock'
import { useHistory } from 'react-router-dom'

export default React.memo(function QuestionWriteSection() {
  const [title, onChangeTitle] = useInput('')
  const [content, setContent] = useState('')
  const [hashtagText, setHashtagText] = useState('')
  const [hashtagList, setHashtagList] = useState([])
  //const hashtagPattern = /^\#[a-zA-Z0-9]+[\s\,]$/g;
  const splitPoint = /\,/g

  const { userID, userNickname } = useSelector((state) => {
    return {
      userID: state.auth.userID,
      userNickname: state.auth.userNickname,
    }
  }) || {
    userID: '123456789012345678901234',
    userNickname: '익명',
  }

  const dispatch = useDispatch()

  function onChangeContent(e) {
    setContent(e.target.value)
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
      setHashtagText(e.target.value)
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
      <section>
        <form onSubmit={onSubmitForm}>
          <div>
            <label htmlFor="title">title: </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={onChangeTitle}
            />
          </div>
          본문
          <MarkdownEditorBlock
            initialContent={''}
            onChangeContentProps={onChangeContent}
          />
          <div>
            <label htmlFor="hashtag">hashtag: </label>
            <input
              type="text"
              id="hashtag"
              value={hashtagText}
              onChange={onChangeHashtagText}
            />
          </div>
          <div>
            hashtag가 제대로 체크 되나:{' '}
            {hashtagList.map((element, index) => {
              return (
                <div key={index}>
                  <a href="/" style={{ color: 'blue' }}>
                    {element}
                  </a>
                </div>
              )
            })}
          </div>
          <div className="button">
            <button type="submit">Send your message</button>
          </div>
        </form>
      </section>
      <section>
        <MarkdownRenderingBlock content={content} />
      </section>
    </>
  )
})
