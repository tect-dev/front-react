import React, { useState, useCallback } from 'react'
import styled from "styled-components"
import { fontSize } from '../../lib/constants'
import { createAnswer } from '../../redux/board'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

// answer editing 컴포넌트는 맨 밑에 있음.

export const AnswerEditor = ({ postID, answers, setAnswers, user }) => {
  const [ content, setContent ] = useState('')
  const dispatch = useDispatch()
  const onChangeContent = useCallback(e => {
    setContent(e.target.value)
  }, [])
  const onSubmitContent = useCallback(async e => {
    e.preventDefault()

    if(!content){
      return
    }

    await dispatch(createAnswer({
      questionID: postID,
      contentType: 'answer',
      content: content,
    }))
    setContent('')
    const tempAnswer = {
      eachAnswer: {
        author: {
          displayName: user.userNickname,
          // firebaseUid: user.userID
          //  // MongoDB에서 id를 주므로 추후 socket.io 등을 이용하여
          //  // 사후적으로 _id를 주입할 필요가 있음.
        },
        createdAt: (new Date()).toISOString(),
        questionID: postID,
        contentType: 'answer',
        content: content,
        like: 0
      }
    }
    setAnswers([...answers, tempAnswer])
  })
  return (
    <Container>
      <AnswerTextarea
        value={content}
        onChange={onChangeContent}
        placeholder="댓글을 입력해주세요"
      />
      <AnswerEditor_Right>
        <Anonymous>
          <span>
            익명
          </span>
          <input
            type="checkbox"
            id="anonymousCheck"
          />
          <label htmlFor="anonymousCheck">
          </label>
        </Anonymous>
        <AnswerSubmit onClick={onSubmitContent}>
          등록
        </AnswerSubmit>
      </AnswerEditor_Right>
    </Container>
  )
}


const Container = styled.div`
  padding: 20px;
  font-size: ${fontSize.medium};
  border-radius: 17px;
  background: #b2c8b4;
  margin-bottom: 30px;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const AnswerEditor_Right = styled.div`
  display: flex;
`

export const AnswerTextarea = styled.textarea`
  all: unset;
  color: #fff;
  
  width: calc(100% - 150px);

  &::placeholder {
    color: #fff;
  }
`

const Anonymous = styled.div`
  display: flex;
  align-items: center;
  color: #f8f6ed;
  margin-right: 16px;

  input {
    display: none;

    &:checked + label {
      background: #f8f6ed;
    }
  }
  label {
    display: inline-block;
    cursor: pointer;
    width: 9px;
    height: 9px;
    background: none;
    border: 1px solid #f8f6ed;
    border-radius: 3px;
  }
`

const AnswerSubmit = styled.button`
  all:unset;
  cursor: pointer;
  padding: 5px 20px;
  font-size: ${fontSize.medium};
  background: #f8f6ed;
  color: #b2c8b4;
  border-radius: 10px;
`

const Button = styled(AnswerSubmit)`
  background: #b2c8b4;
  color: #f8f6ed;
`

const AnswerTextarea2 = styled(AnswerTextarea)`
  color: black;
`