import React, { useState, useCallback, useEffect } from 'react'
import { updateAnswer } from '../../redux/updatePost'
import { deleteAnswer } from '../../redux/deletePost'

import styled from 'styled-components'
import { uid } from 'uid'
import { useDispatch } from 'react-redux'
import { Button } from '../../components/Button'
import MarkdownEditorBlock from '../../components/MarkdownEditorBlock'
import MarkdownRenderingBlock from '../../components/MarkdownRenderingBlock'

import { mediaSize } from '../../lib/constants'
import { createAnswerComment, deleteAnswerComment } from '../../redux/comment'

export default React.memo(function AnswerBlock({ answerData }) {
  const [answer, setAnswer] = useState(answerData.eachAnswer)
  const [isEditingAnswer, setIsEditingAnswer] = useState(false)
  const [editingAnswerContent, setEditingAnswerContent] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [commentList, setCommentList] = useState(answerData.answerComments)

  const dispatch = useDispatch()

  const onDeleteAnswer = useCallback(() => {
    dispatch(deleteAnswer(answer._id))
  }, [])
  const onStartEditAnswer = useCallback(() => {
    // 여기서 setEditingAnswerContent를 설정해준다.
  }, [])
  const onChangeAnswerContent = useCallback(
    (value) => {
      setEditingAnswerContent(value)
    },
    [editingAnswerContent]
  )
  const onUpdateAnswer = useCallback(() => {
    dispatch(updateAnswer(answer._id))
  }, [])

  const onSubmitComment = useCallback(
    (e) => {
      e.preventDefault()
      if (!commentContent) {
        return
      }

      const uid24 = uid(24)
      const formData = {
        commentID: uid24,
        postType: 'answer',
        content: commentContent,
        answerID: answer._id,
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

  const onChangeComment = useCallback(
    (e) => {
      e.preventDefault()
      setCommentContent(e.target.value)
    },
    [commentContent]
  )

  return (
    <AnswerBlockContainer>
      {isEditingAnswer ? (
        <>
          <MarkdownEditorBlock
            contentProps={editingAnswerContent}
            onChangeContentProps={onChangeAnswerContent}
            height="350px"
            width="41vw"
          />
          <MarkdownRenderingBlock content={editingAnswerContent} />
          <Button onClick={onUpdateAnswer}>수정완료</Button>
        </>
      ) : (
        <>
          <MarkdownRenderingBlock content={answer.content} />
          <div>답변 작성자: {answer.author.displayName}</div>
          <div>마지막 수정일: {answer.lastUpdate}</div>
          <div>
            {commentList?.map((comment) => {
              return (
                <>
                  <div>댓글 작성자: {comment.author.displayName}</div>
                  <div>댓글 내용: {comment.content}</div>
                  <div>댓글 생성일: {comment.createdAt}</div>
                </>
              )
            })}
          </div>
          <textarea value={commentContent} onChange={onChangeComment} />
          <Button onClick={onSubmitComment}>comment</Button>
        </>
      )}
    </AnswerBlockContainer>
  )
})

const AnswerBlockContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 40px;
  padding: 20px;
  ${mediaSize.small} {
  }
  box-shadow: 4px 2px 6px 0px #d7dbe2, -4px -2px 4px 0px #ffffff;
`
