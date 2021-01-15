import React, { useEffect, useState, useCallback } from 'react'
import MarkdownRenderingBlock from '../MarkdownRenderingBlock'
import CommentListBlock from '../CommentListBlock'
import MarkdownEditorBlock from '../MarkdownEditorBlock'
import { createAnswer } from '../../redux/createPost'
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
  const [content, setContent] = useState('')
  const { userID, userNickname } = useSelector((state) => {
    return {
      userID: state.auth.userID,
      userNickname: state.auth.userNickname,
    }
  })

  const dispatch = useDispatch()

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
      const tempAuthorID = '123456789012345678901234'
      //const tempDate = new Date()
      //const nowTime = tempDate.now()
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
          <div key={index}>
            <div className="content">
              answer{index}
              {element.answerBody ? (
                <MarkdownRenderingBlock content={element.answerBody.content} />
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
                <button>answer 수정</button>
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
