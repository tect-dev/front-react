import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { colorPalette } from '../lib/constants'
import { refineDatetime } from '../lib/refineDatetime'

import {
  updateQuestionComment,
  deleteQuestionComment,
  updateAnswerComment,
  deleteAnswerComment,
} from '../redux/comment'

const CommentBox = styled.div`
  border-top: 1px solid ${colorPalette.gray5};
  padding-top: 5px;
  padding-bottom: 25px;
`

const CommentInfo = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding-bottom: 5px;
`
const Datetime = styled.div`
  color: ${colorPalette.gray5};
`

export const CommentBlock = ({
  comment,
  deleted,
  displayName,
  content,
  createdAt,
  contentType,
}) => {
  const [isEditingComment, setIsEditingComment] = useState(false)
  const [commentContent, setCommentContent] = useState(content)

  const dispatch = useDispatch()

  function onChangeCommentContent(e) {
    e.preventDefault()
    setCommentContent(e.target.value)
  }

  function finishEditingComment() {
    if (contentType === 'question') {
      dispatch(updateQuestionComment(commentContent, comment._id))
    } else if (contentType === 'answer') {
      dispatch(updateAnswerComment(commentContent, comment._id))
    }
    setIsEditingComment(false)
  }
  function onDeleteComment() {
    if (contentType === 'question') {
      dispatch(deleteQuestionComment(comment._id))
    } else if (contentType === 'answer') {
      dispatch(deleteAnswerComment(comment._id))
    }
  }

  return (
    <CommentBox>
      <CommentInfo>
        <div>작성자: {displayName}</div>
        <Datetime>{createdAt}</Datetime>
      </CommentInfo>
      {deleted && !isEditingComment ? (
        <div>삭제된 댓글입니다.</div>
      ) : (
        <div>{commentContent}</div>
      )}
      {isEditingComment ? (
        <CommentTextarea
          value={commentContent}
          onChange={onChangeCommentContent}
        />
      ) : (
        ''
      )}
      {isEditingComment ? (
        <>
          <button
            onClick={() => {
              finishEditingComment(commentContent, comment._id)
            }}
          >
            수정 완료
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              setIsEditingComment(true)
              //  setCommentContent(comment.commentContent)
            }}
          >
            댓글 수정
          </button>
          <button
            onClick={() => {
              onDeleteComment(comment._id)
            }}
          >
            댓글 삭제
          </button>
        </>
      )}
    </CommentBox>
  )
}

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
