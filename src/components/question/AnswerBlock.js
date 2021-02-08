import React, { useState, useCallback, useEffect } from 'react'
import { updateAnswer } from '../../redux/updatePost'
import { deleteAnswer } from '../../redux/deletePost'

import styled from 'styled-components'
import { uid } from 'uid'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../../components/Button'
import MarkdownEditorBlock from '../../components/MarkdownEditorBlock'
import MarkdownRenderingBlock from '../../components/MarkdownRenderingBlock'

import { mediaSize } from '../../lib/constants'
import { createAnswerComment } from '../../redux/comment'

import { CommentBlock } from '../CommentBlock'
import { colorPalette } from '../../lib/constants'
import { refineDatetime } from '../../lib/functions'

export default React.memo(function AnswerBlock({ answerData }) {
  const [answer, setAnswer] = useState(answerData.eachAnswer)
  const [isEditingAnswer, setIsEditingAnswer] = useState(false)
  const [editingAnswerContent, setEditingAnswerContent] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [commentList, setCommentList] = useState(answerData.answerComments)

  const { userID, displayName } = useSelector((state) => {
    return { userID: state.auth.userID, displayName: state.auth.displayName }
  })
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
        author: {
          displayName: displayName,
        },

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
          <AnswerHeader>
            <div>답변 작성자: {answer.author.displayName}</div>
            <Datetime>
              {answer.createdAt === answer.updatedAt ? (
                <>{refineDatetime(answer.createdAt)}</>
              ) : (
                <>{refineDatetime(answer.updatedAt)} (수정일)</>
              )}
            </Datetime>
          </AnswerHeader>
          <MarkdownRenderingBlock content={answer.content} />
          <br />
          <br />
          <h3>댓글 {commentList.length}</h3>
          <br />
          <div>
            {commentList?.map((comment) => {
              return (
                <CommentBlock
                  comment={comment}
                  deleted={comment.deleted}
                  displayName={comment?.author?.displayName}
                  content={comment.content}
                  createdAt={comment.createdAt}
                  commentHost={comment?.author?.firebaseUid === userID}
                  contentType="answer"
                />
              )
            })}
          </div>
          {answer._id !== '임시' ? (
            <>
              <CommentTextarea
                value={commentContent}
                onChange={onChangeComment}
              />
              <Button onClick={onSubmitComment}>comment</Button>
            </>
          ) : (
            ''
          )}
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

const AnswerHeader = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding-bottom: 10px;
`

const Datetime = styled.div`
  color: ${colorPalette.gray5};
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
