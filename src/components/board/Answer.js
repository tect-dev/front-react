import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import {
  PostContainer,
  PostHeader,
  PostHeader_Left,
  AuthorName,
  Likes,
  PostFooter,
  Button,
} from '../../pages/board/PostDetailPage'
import LikeSproutGray from '../../assets/LikeSproutGray.svg'
import LikeSproutGreen from '../../assets/LikeSproutGreen.svg'

import { fontSize, AnonymousSVG, colorPalette } from '../../lib/constants'
import { setUserPlace } from '../../redux/auth'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAnswer, updateAnswer, likeAnswer } from '../../redux/board'
import { useHistory } from 'react-router-dom'

export const Answer = ({ answer, user, answers, setAnswers }) => {
  const { myID } = useSelector((state) => {
    return { myID: state.auth.userID }
  })
  const [isEdit, setIsEdit] = useState(false)
  const [content, setContent] = useState(answer.eachAnswer.content)
  const [isLiked, setIsLiked] = useState(false)
  const [localPostLike, setLocalPostLike] = useState(answer.eachAnswer.like)
  //const answerID = answer.eachAnswer.author?.firebaseUid

  useEffect(() => {
    if (
      answer.eachAnswer.like_user?.find((ele) => {
        return ele === myID
      })
    ) {
      setIsLiked(true)
    } else {
      setIsLiked(false)
    }
  }, [myID])

  const onSetContent = useCallback((e) => {
    setContent(e.target.value)
  }, [])

  const dispatch = useDispatch()

  const onUpdateAnswer = useCallback(async (answerID, data) => {
    setIsEdit(false)
    await dispatch(updateAnswer(answerID, data))
  }, [])

  const onDeleteAnswer = useCallback(async (answerID) => {
    const deleted = answers.filter(
      (answer) => answer.eachAnswer._id !== answerID
    )
    setAnswers(deleted)
    await dispatch(deleteAnswer(answerID))
  }, [])

  return (
    <Container>
      <PostHeader>
        <PostHeader_Left>
          <AnonymousSVG />
          <AuthorName>{answer.eachAnswer.author.displayName}</AuthorName>
        </PostHeader_Left>
        {user.userID === answer?.eachAnswer?.author?.firebaseUid && isLiked ? (
          <Likes
            onClick={() => {
              dispatch(likeAnswer(answer.eachAnswer._id))
              setIsLiked(false)
              setLocalPostLike(localPostLike - 1)
            }}
          >
            <img
              src={LikeSproutGreen}
              style={{ width: '24px', height: '24px' }}
            />
            <span style={{ color: '#6d9b7b' }}>{localPostLike}</span> likes
          </Likes>
        ) : null}
        {user.userID === answer?.eachAnswer?.author?.firebaseUid && !isLiked ? (
          <Likes
            onClick={() => {
              dispatch(likeAnswer(answer.eachAnswer._id))
              setIsLiked(true)
              setLocalPostLike(localPostLike + 1)
            }}
          >
            <img
              src={LikeSproutGray}
              style={{ width: '24px', height: '24px' }}
            />
            <span style={{ color: '#6d9b7b' }}>{localPostLike}</span> likes
          </Likes>
        ) : null}
      </PostHeader>
      {isEdit ? (
        <AnswerTextarea value={content} onChange={onSetContent} />
      ) : (
        <AnswerContent>{content}</AnswerContent>
      )}
      {user.userID === answer?.eachAnswer?.author?.firebaseUid ? (
        <PostFooter>
          {isEdit ? (
            <>
              <Button
                onClick={(e) => {
                  onUpdateAnswer(answer.eachAnswer._id, content)
                }}
              >
                완료
              </Button>
              <Button
                onClick={(e) => {
                  setIsEdit(false)
                  setContent(answer.eachAnswer.content)
                }}
              >
                취소
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={(e) => {
                  setIsEdit(true)
                }}
              >
                수정
              </Button>
              <Button
                onClick={() => {
                  onDeleteAnswer(answer.eachAnswer._id)
                }}
              >
                삭제
              </Button>
            </>
          )}
        </PostFooter>
      ) : (
        ''
      )}
    </Container>
  )
}

const AnswerContent = styled.div`
  font-size: ${fontSize.medium};
  color: ${colorPalette.gray9};
  margin-bottom: 10px;
`

const Container = styled.div`
  padding: 10px 0px;
  box-sizing: border-box;
`
const AnswerTextarea = styled.textarea`
  all: unset;
  color: #000;
  width: calc(100% - 150px);
  &::placeholder {
    color: #fff;
  }
`
