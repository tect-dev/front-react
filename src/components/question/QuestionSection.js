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
import { mediaSize } from '../../lib/constants'
import {
  sortISOByTimeStamp,
  isoStringToNaturalLanguage,
  refineDatetime
} from '../../lib/functions'
import {
  createQuestionComment,
  deleteQuestionComment,
  updateQuestionComment,
} from '../../redux/comment'

import { CommentBlock } from '../CommentBlock'
import { colorPalette } from '../../lib/constants'

export default React.memo(function QuestionSection({ data }) {
  const [question, setQuestion] = useState(data.question)
  const [content, setContent] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [commentList, setCommentList] = useState(
    data.questionComments.sort((a, b) => {
      sortISOByTimeStamp(a.createdAt, b.createdAt, -1)
    })
  )
  const [isEditingComment, setIsEditingComment] = useState(false)

  const { userID, displayName } = useSelector((state) => {
    return { userID: state.auth.userID, displayName: state.auth.displayName }
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
      //e.preventDefault()
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
        author: {
          displayName: displayName,
        },

        createdAt: '지금',
      }
      dispatch(createQuestionComment(formData))
      setCommentList([...commentList, tempComment])
      setCommentContent('')
    },
    [commentContent, commentList]
  )

  function finishEditingComment(commentContent, commentID) {
    dispatch(updateQuestionComment(commentContent, commentID))
    setIsEditingComment(false)
  }
  function onDeleteComment(commentID) {
    dispatch(deleteQuestionComment(commentID))
  }

  return (
    <QuestionContainer>
      <QuestionBodyContainer>
        <QuestionHeader>
          <QuestionTitle>
            <h2>Q. {`\u00A0`}</h2>
            <h2>{question.title}</h2>
          </QuestionTitle>
          <QuesstionInfo>
            <div>
              질문 작성자:{' '}
              <Link to={`/user/${question?.author?._id}`}>
                {question?.author?.displayName}
              </Link>
            </div>
            <Datetime>
              {question?.createdAt === question?.updatedAt ? (
                <>{refineDatetime(question?.createdAt)}</>
              ) : (
                <>{refineDatetime(question?.updatedAt)} (수정일)</>
              )}
            </Datetime>
          </QuesstionInfo>

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
            {/* <br /> */}
          </div>
        </QuestionHeader>

        <div className="content">
          <MarkdownRenderingBlock content={question?.content} />
          <br />
          {/* <br /> */}
        </div>

        {/* 게시글의 id 와 유저의 id 가 일치하고
            질문에 답변 및 코멘트가 달리지 않는 경우에만 수정과 삭제가 가능*/}
        {/*userID === question.author._id &&
        data.answerList.lenghth !== 0 &&
        data.questionComments.length !== 0*/}
        {userID === question?.author?.firebaseUid ? (
          <>
            <Link to={`/question/edit/${question?._id}`}>
              <Button>글 수정</Button>
            </Link>
            <Button onClick={onDeleteQuestion}>글 삭제</Button>
          </>
        ) : (
          ''
        )}
      </QuestionBodyContainer>
      <br />
      <QuestionCommentContainer>
        <h3>댓글 {commentList.length}</h3>
        <br />
        {commentList.map((comment) => {
          if (comment) {
            return (
              <>
                <CommentBlock
                  comment={comment}
                  deleted={comment.deleted}
                  displayName={comment.author.displayName}
                  commentHost={comment.author.firebaseUid === userID}
                  content={comment.content}
                  createdAt={comment.createdAt}
                  contentType="question"
                />
              </>
            )
          }
        })}
        <CommentTextarea value={commentContent} onChange={onChangeComment} />
        <Button onClick={onSubmitComment}>comment</Button>
      </QuestionCommentContainer>
    </QuestionContainer>
  )
})

const QuestionContainer = styled.div`
  padding: 1rem 1.5rem;

  ${mediaSize.small} {
    width: inherit;
    box-sizing: border-box;
  }
`

const QuestionHeader = styled.div``

const QuestionBodyContainer = styled.div`
  width: inherit;
  margin-bottom: 10px;
`

const QuestionCommentContainer = styled.div`
  width: inherit;
`
const QuestionTitle = styled.div`
  display: flex;
  margin-bottom: 20px;
`

const Datetime = styled.div`
  color: ${colorPalette.gray5};
`

const QuesstionInfo = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`
const CommentTextarea = styled.textarea`
  display: -moz-box;
  width: 100%;
  border-radius: 5px;
  transition: all ease 0.2s;
  min-height: 50px;
  /* resize: none; */
  &:focus {
    border: 1px solid rgba(0, 190, 190, 0.2);
    outline: none;
    box-shadow: 0px 0px 3px 0px rgba(0, 190, 190, 0.5);

    transition: all ease 0.2s;
  }
`
