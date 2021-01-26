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
import comment, { createAnswerComment } from '../../redux/comment'

export default React.memo(function AnswerBlock({ answer }) {
  const [isEditingAnswer, setIsEditingAnswer] = useState(false)
  const [editingAnswerContent, setEditingAnswerContent] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [commentList, setCommentList] = useState(
    answer.answerComment ? answer.answerComment : []
  )

  const dispatch = useDispatch()

  const onDeleteAnswer = useCallback(() => {}, [])
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

          {commentList?.map((comment) => {
            return (
              <>
                <div>{comment.content}</div>
                <div>{comment.createdAt}</div>
              </>
            )
          })}

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
