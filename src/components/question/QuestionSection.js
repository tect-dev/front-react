import React, { useState, useCallback, useEffect, useDebugValue } from 'react'
import { Link } from 'react-router-dom'
import MarkdownRenderingBlock from '../MarkdownRenderingBlock'
import CommentListBlock from '../CommentListBlock'
import MarkdownEditorBlock from '../MarkdownEditorBlock'
import { TagBlock } from '../TagBlock'
import { Button } from '../Button'
import { uid } from 'uid'
import { useSelector, useDispatch } from 'react-redux'
import { deleteQuestion } from '../../redux/deletePost'
import styled from 'styled-components'
import {
  sortISOByTimeStamp,
  isoStringToNaturalLanguage,
} from '../../lib/functions'
import {
  createQuestionComment,
  deleteQuestionComment,
  updateQuestionComment,
} from '../../redux/comment'

export default React.memo(function QuestionSection({ data }) {
  const [question, setQuestion] = useState(data.questionList[0])
  const [content, setContent] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [commentList, setCommentList] = useState(
    data.questionList
      .map((element) => {
        if (element.questionComment) {
          return element.questionComment
        }
      })
      .sort((a, b) => {
        sortISOByTimeStamp(a.createdAt, b.createdAt, -1)
      })
  )

  const { userID } = useSelector((state) => {
    return { userID: state.auth.userID }
  })

  useEffect(() => {
    console.log('작성자: ', data.questionList[0])
  }, [])

  const dispatch = useDispatch()

  const onChangeComment = useCallback(
    (e) => {
      e.preventDefault()
      setCommentContent(e.target.value)
    },
    [commentContent]
  )

  const onChangeContent = useCallback(
    (value) => {
      setContent(value)
    },
    [content]
  )

  const onDeleteQuestion = useCallback(() => {
    //alert('정말 삭제합니까?');
    dispatch(deleteQuestion(question._id))
  }, [dispatch])

  const onSubmitComment = useCallback(
    async (e) => {
      e.preventDefault()
      if (!commentContent) {
        return
      }
      const uid24 = uid(24)
      const formData = {
        commentID: uid24,
        postType: 'question',
        content: commentContent,
        postID: question._id,
        parentID: uid24,
      }
      const tempComment = {
        ...formData,
        createdAt: '지금',
      }
      dispatch(createQuestionComment(formData))
      setCommentList([...commentList, tempComment])
      setCommentContent('')
    },
    [commentContent, commentList]
  )
  function deleteComment() {
    alert('정말 삭제합니까?')
  }

  return (
    <QuestionContainer>
      <div className="title">
        <h2>Q. {question.title}</h2>
        <br />
      </div>
      <div className="hashtags">
        {question?.hashtags?.map((tag, index) => {
          return (
            <TagBlock
              key={index}
              text={tag}
              function={() => {
                alert('tag clicked!')
              }}
            />
          )
        })}
        <br />
        <br />
      </div>
      <div className="content">
        <MarkdownRenderingBlock content={question.content} />
        <br />
        <br />
      </div>

      <div>
        {question.updatedAt.substr(0, 4)}년 {question.updatedAt.substr(5, 2)}월{' '}
        {question.updatedAt.substr(8, 2)}일
      </div>
      <div>
        {question.questionAuthor.map((element) => {
          return <Link to={`/user/${element._id}`}>{element.nickname}</Link>
        })}
      </div>
      {question.questionAuthor.map((element) => {
        if (
          element._id === userID &&
          data.answerList.length === 0 &&
          userID !== '000000000000000000000000'
        ) {
          return (
            <>
              <Button>
                <Link to={`/question/edit/${question._id}`}>질문 수정하기</Link>
              </Button>
              <Button onClick={onDeleteQuestion}>질문 삭제하기</Button>
            </>
          )
        }
      })}

      {commentList.map((comment) => {
        if (comment) {
          return (
            <>
              <div>{comment.content}</div>
              <div>{comment.createdAt}</div>
            </>
          )
        }
      })}
      <textarea value={commentContent} onChange={onChangeComment} />
      <Button onClick={onSubmitComment}>question 에 댓글달기</Button>
    </QuestionContainer>
  )
})

const QuestionContainer = styled.div`
  padding: 1rem 1.5rem;
`
