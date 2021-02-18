import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import {
  PostContainer, PostHeader, PostHeader_Left,  AnonymousSVG,  
  AuthorName,  Likes, PostFooter, Button
} from '../../pages/board/PostDetailPage'
import { fontSize } from '../../lib/constants'
import { setUserPlace } from '../../redux/auth'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAnswer, updateAnswer } from '../../redux/board'
import { useHistory } from 'react-router-dom'

export const Answer = ({ answer, user, answers, setAnswers }) => {
  const [ isEdit, setIsEdit ] = useState(false)
  const [ content, setContent ] = useState(answer.eachAnswer.content)

  const onSetContent = useCallback((e) => {
    setContent(e.target.value)
  }, [])

  const dispatch = useDispatch()

  const onUpdateAnswer = useCallback(async (answerID, data)=>{
    setIsEdit(false)
    await dispatch(updateAnswer(answerID, data))
  }, [])

  const onDeleteAnswer = useCallback(async (answerID)=>{
    const deleted = answers.filter(answer => answer.eachAnswer._id !== answerID)
    setAnswers(deleted)
    await dispatch(deleteAnswer(answerID))
  }, [])

  return (
    <Container>
      <PostHeader>
        <PostHeader_Left>
          <AnonymousSVG/>
          <AuthorName>
            {answer.eachAnswer.author.displayName}
          </AuthorName>
        </PostHeader_Left>
        <Likes>
          좋아요 {answer.eachAnswer.like}
        </Likes>
      </PostHeader>
      {isEdit 
        ? <AnswerTextarea
            value={content}
            onChange={onSetContent}
          />
        : <AnswerContent>
            {content}
          </AnswerContent>
      }
      {user.userID === answer?.eachAnswer?.author?.firebaseUid ? (
        <PostFooter>
          {isEdit
            ? <>
                <Button onClick={(e)=>{onUpdateAnswer(answer.eachAnswer._id, content)}}>
                  완료
                </Button>
                <Button onClick={(e)=>{
                  setIsEdit(false)
                  setContent(answer.eachAnswer.content)
                }}>취소</Button>
              </>
            : <>
                <Button onClick={(e)=>{setIsEdit(true)}}>
                  수정
                </Button>
                <Button onClick={()=>{onDeleteAnswer(answer.eachAnswer._id)}}>삭제</Button>
              </>
          }
          </PostFooter>
            ) : (
          ''
      )}
    </Container>
  )
}

const AnswerContent = styled.div`
  font-size: ${fontSize.medium};
  color: #999;
  margin-bottom: 10px;
`

const Container = styled.div`
  background: #fffef8;
  border-radius: 22px;
  border: 1px solid #6d9b7b;
  padding: 20px 20px 20px 20px;
  margin-bottom: 10px;
  `
const AnswerTextarea = styled.textarea`
  all: unset;
  color: #000;
  width: calc(100% - 150px);
  &::placeholder {
    color: #fff;
  }
`