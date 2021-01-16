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
import { sortISOByTimeStamp } from '../../lib/functions'

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

  function onChangeAnswerContent(e) {
    setEditedAnswerContent(e.target.value)
  }

  // 새로운 answer 를 추가할때 사용된다.
  const onChangeContent = useCallback(
    (e) => {
      setContent(e.target.value)
    },
    [content]
  )

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
    [content, answers]
  )

  const onUpdateAnswer = useCallback(
    (answerID, index) => {
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
    [editedAnswerContent, answers]
  )

  const onDeleteAnswer = useCallback(
    (answerID, index) => {
      dispatch(deleteAnswer(answerID))
      answers.splice(index, 1)
      setAnswers([...answers])
    },
    [answers]
  )

  return (
    <>
      {answers.map((element, index) => {
        return (
          <>
            {isEditingAnswer && editedAnswerIndex === index ? (
              // answer 가 수정중일때
              <div key={index}>
                <MarkdownEditorBlock
                  contentProps={element.answerBody.content}
                  onChangeContentProps={onChangeAnswerContent}
                />
                <button
                  onClick={() => {
                    onUpdateAnswer(element._id, index)
                  }}
                >
                  수정완료
                </button>
              </div>
            ) : (
              // answer 가 수정중이 아닐때
              <div key={index}>
                <div className="content">
                  answer{index}
                  {element.answerBody ? (
                    <MarkdownRenderingBlock
                      content={element.answerBody.content}
                    />
                  ) : (
                    ''
                  )}
                </div>
                <div>
                  <Link to={`/user/${element.answerBody.authorID}`}>
                    답변 작성자 닉네임: {element.answerBody.authorNickname}
                  </Link>
                </div>
                <div>마지막 업데이트 날짜: {element.answerBody.lastUpdate}</div>

                {userID !== '000000000000000000000000' &&
                userID === element.answerBody.authorID ? (
                  <>
                    <button
                      onClick={() => {
                        startEditAnswer(element, index)
                      }}
                    >
                      answer 수정
                    </button>
                    <button
                      onClick={() => {
                        onDeleteAnswer(element._id, index)
                      }}
                    >
                      answer 삭제
                    </button>
                  </>
                ) : (
                  ''
                )}

                {/* <CommentListBlock commentList={element.answerBody.comments} /> */}
                <MarkdownEditorBlock />
                <button>answer에 댓글달기</button>
              </div>
            )}
          </>
        )
      })}

      <MarkdownEditorBlock
        className="answerWrite"
        onChangeContentProps={onChangeContent}
        contentProps={content}
      />
      <button onClick={addAnswer}>answer 추가하기</button>
    </>
  )
})
