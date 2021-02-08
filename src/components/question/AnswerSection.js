import React, { useEffect, useState, useCallback } from 'react'
import MarkdownRenderingBlock from '../MarkdownRenderingBlock'
import CommentListBlock from '../CommentListBlock'
import MarkdownEditorBlock from '../MarkdownEditorBlock'
import AnswerBlock from './AnswerBlock'
import { createAnswer } from '../../redux/createPost'
import { updateAnswer } from '../../redux/updatePost'
import { deleteAnswer } from '../../redux/deletePost'
import { createAnswerComment } from '../../redux/comment'
import { useDispatch, useSelector } from 'react-redux'
import { uid } from 'uid'
import { Link } from 'react-router-dom'
import {
  sortISOByTimeStamp,
  isoStringToNaturalLanguage,
  matchCommentAndAnswer,
} from '../../lib/functions'
import { Button } from '../../components/Button'
import styled from 'styled-components'
import { userDefaultID, mediaSize } from '../../lib/constants'

export default React.memo(function AnswerSection({ data }) {
  const [question, setQuestion] = useState(data.question)
  const [answers, setAnswers] = useState(
    data.answerList
    //.sort((a, b) => {
    //  return sortISOByTimeStamp(a.createdAt, b.createdAt, -1)
    //  // 마지막 인자의 -1은 sorting 순서를 결정. 1이면 큰게 앞으로, -1이면 작은게 앞으로.
    //})
  )

  // answers에서 중복되는 id 가 있다면 거기서 comment 만 추출하고, 새로운 배열로 다듬어야된다.

  // 새로운 answer 를 작성할때 사용하는 state: content
  const [content, setContent] = useState('')
  const [isEditingAnswer, setEditingAnswer] = useState(false)
  const [editedAnswerIndex, setEditedAnswerIndex] = useState()
  // 기존 answer 를 수정할때 사용하는 state: editedAnswerContent
  const [editedAnswerContent, setEditedAnswerContent] = useState('')

  const { userID, displayName } = useSelector((state) => {
    return {
      userID: state.auth.userID,
      displayName: state.auth.displayName,
    }
  })

  const dispatch = useDispatch()

  function startEditAnswer(answer, index) {
    setEditingAnswer(true)
    setEditedAnswerIndex(index)
    setEditedAnswerContent(answer.answerBody.content)
  }

  function onChangeAnswerContent(value) {
    setEditedAnswerContent(value)
  }

  // 새로운 answer 를 추가할때 사용된다.
  const onChangeContent = useCallback((value) => {
    setContent(value)
  }, [])

  const addAnswer = useCallback(
    (e) => {
      e.preventDefault()
      if (!content) {
        return alert('게시글을 작성하세요.')
      }

      const uid24 = uid(24)
      const formData = {
        answerID: uid24,
        questionID: question._id,
        contentType: 'answer',
        content: content,
      }
      const tempAnswer = {
        eachAnswer: {
          type: 'answer',
          like: 0,
          unlike: 0,
          selected: false,
          _id: '임시',
          author: {
            deleted: false,
            points: 0,
            posts: ['임시'],
            _id: '임시',
            email: '임시',
            firebaseUid: '임시',
            displayName: displayName,
            createdAt: '임시',
            updatedAt: '임시',
            __v: 1,
          },
          questionID: question._id,
          content: content,
          createdAt: '지금',
          updatedAt: '지금',
          __v: 0,
        },
        answerComments: [],
      }
      dispatch(createAnswer(formData))
      setAnswers([...answers, tempAnswer])
      setContent('')
    },
    [content, answers, question._id, dispatch, userID, displayName]
  )

  const onUpdateAnswer = useCallback(
    (answerID, index) => {
      if (!editedAnswerContent) {
        alert('본문을 입력해 주세요.')
        return
      }
      const data = { content: editedAnswerContent }
      dispatch(updateAnswer(answerID, data))
      setEditingAnswer(false)
      // immer 를 쓰는것보단 이게 나을지도.
      const tempAnswer = {
        eachAnswer: {
          type: 'answer',
          like: 0,
          unlike: 0,
          selected: false,
          _id: '임시',
          author: {
            deleted: false,
            points: 0,
            posts: ['임시'],
            _id: '임시',
            email: '임시',
            firebaseUid: '임시',
            displayName: displayName,
            createdAt: '임시',
            updatedAt: '임시',
            __v: 1,
          },
          questionID: question._id,
          content: content,
          createdAt: '지금',
          updatedAt: '지금',
          __v: 0,
        },
        answerComments: [],
      }

      setAnswers(
        answers.map((answer, answerIndex) => {
          if (answerIndex === index) {
            return tempAnswer
          } else {
            return answer
          }
        })
      )
    },
    [editedAnswerContent, answers, dispatch]
  )

  const onDeleteAnswer = useCallback(
    (answerID, index) => {
      dispatch(deleteAnswer(answerID))
      answers.splice(index, 1)
      setAnswers([...answers])
    },
    [answers, dispatch]
  )

  return (
    <AnswerContainer>
      {answers.length
        ? <h2>{answers.length} Answers</h2>
        : <h2>No Answers</h2>
      }


      {answers.length !== 0
        ? answers.map((answerData, index) => {
            return <AnswerBlock answerData={answerData} key={index} />
          })
        : ''}

      <MarkdownEditorBlock
        contentProps={content}
        onChangeContentProps={onChangeContent}
      />
      <Button onClick={addAnswer}>답변 추가하기</Button>
    </AnswerContainer>
  )
})

const AnswerContainer = styled.div`
  padding: 1rem 1.5rem;
  width: 100%;
  box-sizing: border-box;
  ${mediaSize.small} {
    /* padding: 0; */
  }
`
