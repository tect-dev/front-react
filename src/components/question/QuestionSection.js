import React, { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MarkdownRenderingBlock from '../MarkdownRenderingBlock'
import CommentListBlock from '../CommentListBlock'
import MarkdownEditorBlock from '../MarkdownEditorBlock'
import { TagBlock } from '../TagBlock'
import { Button } from '../Button'
import { uid } from 'uid'
import { useSelector, useDispatch } from 'react-redux'
import { deleteQuestion, deleteComment } from '../../redux/deletePost'
import styled from 'styled-components'

export default React.memo(function QuestionSection({ data }) {
  const [ question, setQuestion ] = useState(data.questionList[0])
  const { userID } = useSelector((state) => {
    return { userID: state.auth.userID }
  })

  const dispatch = useDispatch()

  const onDeleteQuestion = useCallback(() => {
    //alert('정말 삭제합니까?');
    dispatch(deleteQuestion(question._id))
  }, [dispatch])

  function deleteComment() {
    alert('정말 삭제합니까?')
  }

  return (
    <QuestionContainer>
      <div className="title">
        <h2>Q. {question.title}</h2>
        <br />
      </div>
      <div className="hashtags">
        {question?.hashtags?.map((tag, index) => {
          return (
            <TagBlock
              key={index}
              text={tag}
              function={() => {
                alert('tag clicked!')
              }}
            />
          )
        })}
        <br />
        <br />
      </div>
      <div className="content">
        <MarkdownRenderingBlock content={question.content} />
        <br />
        <br />
      </div>

      <div>
        {question.updatedAt.substr(0, 4)}년{' '}
        {question.updatedAt.substr(5, 2)}월{' '}
        {question.updatedAt.substr(8, 2)}일
      </div>
      <div>
        {console.log(question)}
        {question.questionAuthor.length === 0
          ? null
          : <Link to={`/user/${question?.questionAuthor[0]?._id}`}>
              {question.questionAuthor[0]?.nickname}
            </Link>
        }
      </div>
      {question.questionAuthor[0]._id === userID &&
      data.answers.length === 0 &&
      userID !== '000000000000000000000000' ? (
        <>
          <Button>
            <Link to={`/question/edit/${question._id}`}>
              질문 수정하기
            </Link>
          </Button>
          <Button onClick={onDeleteQuestion}>질문 삭제하기</Button>
        </>
      ) : (
        ''
      )}
    </QuestionContainer>
  )
})

const QuestionContainer = styled.div`
  padding: 1rem 1.5rem;
`
