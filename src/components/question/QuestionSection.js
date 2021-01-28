import React, { useState, useCallback, useEffect, useDebugValue } from 'react'
import { Link, useHistory } from 'react-router-dom'
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
  const [question, setQuestion] = useState(data.question)
  const [content, setContent] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [commentList, setCommentList] = useState(
    data.questionComments.sort((a, b) => {
      sortISOByTimeStamp(a.createdAt, b.createdAt, -1)
    })
  )

  const { userID } = useSelector((state) => {
    return { userID: state.auth.userID }
  })

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
        questionID: question._id,
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
  function onDeleteComment() {
    alert('정말 삭제합니까?')
  }

  return (
    <QuestionContainer>
      <QuestionBodyContainer>
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
          {question.updatedAt.substr(0, 4)}년 {question.updatedAt.substr(5, 2)}
          월 {question.updatedAt.substr(8, 2)}일
        </div>
        <div>
          <>
            <Link to={`/user/${question.author._id}`}>
              {question.author.displayName}
            </Link>
            <div>작성자: {question.author.displayName}</div>
          </>
        </div>

        {/* 게시글의 id 와 유저의 id 가 일치하고
            질문에 답변 및 코멘트가 달리지 않는 경우에만 수정과 삭제가 가능*/}
        {userID === question.author._id &&
        data.answerList.lenghth !== 0 &&
        data.questionComments.length !== 0 ? (
          <>
            <Link to={`/question/edit/${question._id}`}>
              <Button>글 수정</Button>
            </Link>
            <Button onClick={onDeleteQuestion}>글 삭제</Button>
          </>
        ) : (
          ''
        )}
      </QuestionBodyContainer>

      <QuestionCommentContainer>
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
      </QuestionCommentContainer>
    </QuestionContainer>
  )
})

const QuestionContainer = styled.div`
  padding: 1rem 1.5rem;
`

const QuestionBodyContainer = styled.div``

const QuestionCommentContainer = styled.div``
