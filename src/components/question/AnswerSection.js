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
} from '../../lib/functions'
import { Button } from '../../components/Button'
import styled from 'styled-components'
import { userDefaultID, mediaSize } from '../../lib/constants'

function extractComment(someList, listType) {
  // 배열내의 원소들을 순회하면서 댓글들만 추출해서, 댓글로 이뤄진 어레이를 리턴.
  let commentList = []
  someList.map((element) => {
    if (element[`${listType}Comment`]) {
      commentList.push(element[`${listType}Comment`])
    }
  })
  return commentList
}
function trimAnswerList(someAnswerList) {
  // 중복되는 id를 전부 날린다.
  return someAnswerList.map((answer) => {
    return someAnswerList.filter((element) => {
      return answer._id === element._id
    })[0]
  })
}

function matchCommentAndAnswer(someAnswerList) {
  const extractedCommentList = extractComment(someAnswerList, 'answer')
  const trimedAnswerList = trimAnswerList(someAnswerList)

  return trimedAnswerList.map((answer) => {
    let matchedAnswer = { ...answer, answerComment: [] }
    for (const someComment of extractedCommentList) {
      if (someComment._id === answer._id) {
        matchedAnswer.answerComment.push(someComment)
      }
    }
    return matchedAnswer
  })
}

export default React.memo(function AnswerSection({ data }) {
  const [question, setQuestion] = useState(data.questionList[0])
  const [answers, setAnswers] = useState(
    matchCommentAndAnswer(data.answerList).sort((a, b) => {
      sortISOByTimeStamp(a.createdAt, b.createdAt, -1)
    })
  )

  // answers에서 중복되는 id 가 있다면 거기서 comment 만 추출하고, 새로운 배열로 다듬어야된다.

  // 새로운 answer 를 작성할때 사용하는 state: content
  const [content, setContent] = useState('')
  const [isEditingAnswer, setEditingAnswer] = useState(false)
  const [editedAnswerIndex, setEditedAnswerIndex] = useState()
  // 기존 answer 를 수정할때 사용하는 state: editedAnswerContent
  const [editedAnswerContent, setEditedAnswerContent] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [commentList, setCommentList] = useState(
    data.answerList
      .map((element) => {
        if (element.answerComment) {
          return element.answerComment
        }
      })
      .sort((a, b) => {
        sortISOByTimeStamp(a.createdAt, b.createdAt, -1)
      })
  )
  const { userID, userNickname } = useSelector((state) => {
    return {
      userID: state.auth.userID,
      userNickname: state.auth.userNickname,
    }
  })

  const dispatch = useDispatch()

  const onChangeComment = useCallback(
    (e) => {
      e.preventDefault()
      setCommentContent(e.target.value)
    },
    [commentContent]
  )

  const onSubmitComment = useCallback(
    async (answer) => {
      if (!commentContent) {
        return
      }
      const uid24 = uid(24)
      const formData = {
        commentID: uid24,
        postType: 'answer',
        content: commentContent,
        postID: answer._id,
        parentID: uid24,
      }
      const tempComment = {
        ...formData,
        createdAt: '지금',
      }
      dispatch(createAnswerComment(formData))
      setCommentList([...commentList, tempComment])
      setCommentContent('')
    },
    [commentContent, commentList]
  )

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
        postID: question._id,
        contentType: 'answer',
        content: content,
      }
      const tempAnswer = {
        __v: 0,
        _id: uid24,
        answerID: uid24,
        answerAuthor: [{ _id: userID, nickname: userNickname }],
        content: content,
        createdAt: '지금', // Date.now() 가 알수없는 오류를 낸다. 생각해보니 걍 이런식으로 써도 될듯.
        lastUpdate: '지금',
        postID: question._id,
      }
      dispatch(createAnswer(formData))
      setAnswers([...answers, tempAnswer])
      setContent('')
    },
    [content, answers, question._id, dispatch, userID, userNickname]
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
        ...answers[index],
        answerBody: {
          ...answers[index].answerBody,
          content: editedAnswerContent,
          lastUpdate: '지금',
        },
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
  // content
  //
  return (
    <AnswerContainer>
      <h3>{answers.length} Answers</h3>
      {answers.map((answer, index) => {
        return <AnswerBlock answer={answer} key={index} />
      })}
      <MarkdownEditorBlock
        className="answerWrite"
        onChangeContentProps={onChangeContent}
        contentProps={content}
        height="250px"
        width="40vw"
      />
      <br />
      <h3>Answer Preview</h3>
      <br />
      <MarkdownRenderingBlock content={content} />
      <br />
      <Button onClick={addAnswer}>답변 추가하기</Button>
    </AnswerContainer>
  )
})

const AnswerContainer = styled.div`
  padding: 1rem 1.5rem;
`
