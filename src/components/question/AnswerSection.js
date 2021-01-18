import React, { useEffect, useState, useCallback } from 'react'
import MarkdownRenderingBlock from '../MarkdownRenderingBlock'
import CommentListBlock from '../CommentListBlock'
import MarkdownEditorBlock from '../MarkdownEditorBlock'
import { createAnswer } from '../../redux/createPost'
import { updateAnswer } from '../../redux/updatePost'
import { deleteAnswer } from '../../redux/deletePost'
import { useDispatch, useSelector } from 'react-redux'
import { uid } from 'uid'
import { Link } from 'react-router-dom'
import {
  sortISOByTimeStamp,
  isoStringToNaturalLanguage,
} from '../../lib/functions'
import { Button } from '../../components/Button'
import styled from 'styled-components'
import { userDefaultID, mediaSize } from '../../lib/constants'

export default React.memo(function AnswerSection({ data }) {
  const [answers, setAnswers] = useState(
    data.answers.sort((a, b) => {
      sortISOByTimeStamp(a.answerBody.createdAt, b.answerBody.createdAt, -1)
    })
  )
  // 새로운 answer 를 작성할때 사용하는 state: content
  const [content, setContent] = useState('')
  const [isEditingAnswer, setEditingAnswer] = useState(false)
  const [editedAnswerIndex, setEditedAnswerIndex] = useState()
  // 기존 answer 를 수정할때 사용하는 state: editedAnswerContent
  const [editedAnswerContent, setEditedAnswerContent] = useState('')
  const { userID, userNickname } = useSelector((state) => {
    return {
      userID: state.auth.userID,
      userNickname: state.auth.userNickname,
    }
  })

  const dispatch = useDispatch()

  function startEditAnswer(answer, index) {
    setEditingAnswer(true)
    setEditedAnswerIndex(index)
    setEditedAnswerContent(answer.answerBody.content)
  }

  function onChangeAnswerContent(value) {
    setEditedAnswerContent(value)
  }

  // 새로운 answer 를 추가할때 사용된다.
  const onChangeContent = useCallback((value) => {
    setContent(value)
  }, [])

  const addAnswer = useCallback(
    (e) => {
      e.preventDefault()
      if (!content) {
        return alert('게시글을 작성하세요.')
      }

      const uid24 = uid(24)
      const formData = {
        answerID: uid24,
        postID: data.question._id,
        contentType: 'answer',
        content: content,
        authorID: userID,
        authorNickname: userNickname,
      }
      const tempAnswer = {
        __v: 0,
        _id: uid24,
        answerBody: {
          answerID: uid24,
          authorID: userID,
          authorNickname: userNickname,
          content: content,
          createdAt: '지금', // Date.now() 가 알수없는 오류를 낸다. 생각해보니 걍 이런식으로 써도 될듯.
          lastUpdate: '지금',
          postID: data.question._id,
        },
      }
      dispatch(createAnswer(formData))
      setAnswers([...answers, tempAnswer])
      setContent('')
    },
    [content, answers, data.question._id, dispatch, userID, userNickname]
  )

  const onUpdateAnswer = useCallback(
    (answerID, index) => {
      if (!editedAnswerContent) {
        alert('본문을 입력해 주세요.')
        return
      }
      const data = { content: editedAnswerContent }
      dispatch(updateAnswer(answerID, data))
      setEditingAnswer(false)
      // immer 를 쓰는것보단 이게 나을지도.
      const tempAnswer = {
        ...answers[index],
        answerBody: {
          ...answers[index].answerBody,
          content: editedAnswerContent,
          lastUpdate: '지금',
        },
      }

      setAnswers(
        answers.map((answer, answerIndex) => {
          if (answerIndex === index) {
            return tempAnswer
          } else {
            return answer
          }
        })
      )
    },
    [editedAnswerContent, answers, dispatch]
  )

  const onDeleteAnswer = useCallback(
    (answerID, index) => {
      dispatch(deleteAnswer(answerID))
      answers.splice(index, 1)
      setAnswers([...answers])
    },
    [answers, dispatch]
  )

  return (
    <AnswerContainer>
      <h3>{answers.length} Answers</h3>
      {answers.map((element, index) => {
        return (
          <AnswerBlock key={index}>
            {isEditingAnswer && editedAnswerIndex === index ? (
              // answer 가 수정중일때
              <div key={index}>
                <MarkdownEditorBlock
                  contentProps={editedAnswerContent}
                  onChangeContentProps={onChangeAnswerContent}
                  height="350px"
                  width="41vw"
                />
                <MarkdownRenderingBlock content={editedAnswerContent} />
                <Button
                  onClick={() => {
                    onUpdateAnswer(element._id, index)
                  }}
                >
                  수정완료
                </Button>
              </div>
            ) : (
              // answer 가 수정중이 아닐때
              <div key={index}>
                <div className="content">
                  {element.answerBody ? (
                    <MarkdownRenderingBlock
                      content={element.answerBody.content}
                    />
                  ) : (
                    ''
                  )}
                  <br />
                </div>

                <div>
                  {isoStringToNaturalLanguage(element.answerBody.lastUpdate)}
                </div>
                <div>
                  {element.answerBody.authorID === userDefaultID ? (
                    `${element.answerBody.authorNickname}`
                  ) : (
                    <Link to={`/user/${element.answerBody.authorID}`}>
                      {element.answerBody.authorNickname}
                    </Link>
                  )}
                </div>

                {userID !== '000000000000000000000000' &&
                userID === element.answerBody.authorID ? (
                  <>
                    <Button
                      onClick={() => {
                        startEditAnswer(element, index)
                      }}
                    >
                      답변 수정
                    </Button>
                    <Button
                      onClick={() => {
                        onDeleteAnswer(element._id, index)
                      }}
                    >
                      답변 삭제
                    </Button>
                  </>
                ) : (
                  ''
                )}

                {/* <CommentListBlock commentList={element.answerBody.comments} /> 
                <MarkdownEditorBlock />
                <Button>answer에 댓글달기</Button>*/}
              </div>
            )}
          </AnswerBlock>
        )
      })}
      <MarkdownEditorBlock
        className="answerWrite"
        onChangeContentProps={onChangeContent}
        contentProps={content}
        height="250px"
        width="40vw"
      />
      <br />
      <h3>Answer Preview</h3>
      <br />
      <MarkdownRenderingBlock content={content} />
      <br />
      <Button onClick={addAnswer}>답변 추가하기</Button>
    </AnswerContainer>
  )
})

const AnswerContainer = styled.div`
  padding: 1rem 1.5rem;
`

const AnswerBlock = styled.div`
  margin-top: 20px;
  margin-bottom: 40px;
  padding: 20px;
  ${mediaSize.small} {
  }
  box-shadow: 4px 2px 6px 0px #d7dbe2, -4px -2px 4px 0px #ffffff;
`
