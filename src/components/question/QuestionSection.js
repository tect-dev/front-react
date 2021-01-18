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
  const [content, setContent] = useState('')
  const { userID } = useSelector((state) => {
    return { userID: state.auth.userID }
  })

  function onChangeContent(value) {
    setContent(value)
  }

  const dispatch = useDispatch()

  const onDeleteQuestion = useCallback(() => {
    //alert('정말 삭제합니까?');
    dispatch(deleteQuestion(data.question._id))
  }, [dispatch])

  function deleteComment() {
    alert('정말 삭제합니까?')
  }

  const onSubmitComment = useCallback(
    async (e) => {
      e.preventDefault()
      if (!content) {
        return
      }
      const formData = new FormData()
      const uid24 = uid(24)
      formData.append('postID', uid24)
      formData.append('contentType', 'question')
      formData.append('content', content)
      formData.append('authorID', '123456789012345678901234')
      formData.append('authorNickname', '임시닉네임')
    },
    [content]
  )

  return (
    <QuestionContainer>
      <div className="title">
        <h2>Q. {data.question.questionBody.title}</h2>
        <br />
      </div>
      <div className="hashtags">
        {data.question.questionBody.hashtags.map((tag, index) => {
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
        <MarkdownRenderingBlock content={data.question.questionBody.content} />
        <br />
        <br />
      </div>

      <div>
        {data.question.updatedAt.substr(0, 4)}년{' '}
        {data.question.updatedAt.substr(5, 2)}월{' '}
        {data.question.updatedAt.substr(8, 2)}일
      </div>
      <div>
        <Link to={`/user/${data.question.questionBody.authorID}`}>
          {data.question.questionBody.authorNickname}
        </Link>
      </div>
      {data.question.questionBody.authorID === userID &&
      data.answers.length === 0 &&
      userID !== '000000000000000000000000' ? (
        <>
          <Button>
            <Link to={`/question/edit/${data.question._id}`}>
              질문 수정하기
            </Link>
          </Button>
          <Button onClick={onDeleteQuestion}>질문 삭제하기</Button>
        </>
      ) : (
        ''
      )}

      {/*<CommentListBlock commentList={question.comments} />
      <MarkdownEditorBlock
        initialContent={''}
        onChangeContentProps={onChangeContent}
      />
      <Button onClick={onSubmitComment}>question 에 댓글달기</Button>*/}
    </QuestionContainer>
  )
})

const QuestionContainer = styled.div`
  padding: 1rem 1.5rem;
`
