import React, { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MarkdownRenderingBlock from '../MarkdownRenderingBlock'
import CommentListBlock from '../CommentListBlock'
import MarkdownEditorBlock from '../MarkdownEditorBlock'
import { TagBlock } from '../TagBlock'
import { Button } from '../Button'
import { uid } from 'uid'
import { useSelector, useDispatch } from 'react-redux'
import {
  deleteQuestion,
  deleteAnswer,
  deleteComment,
} from '../../redux/deletePost'

export default React.memo(function QuestionSection({ data }) {
  const [content, setContent] = useState('')
  const { userID } = useSelector((state) => {
    return { userID: state.auth.userID }
  })

  function onChangeContent(e) {
    setContent(e.target.value)
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
    <>
      <div className="title">Title: {data.question.questionBody.title}</div>
      <div>작성일: {data.question.questionBody.createdAt}</div>
      <div>최종 수정일: {data.question.questionBody.lastUpdate}</div>
      <div className="content">
        <MarkdownRenderingBlock content={data.question.questionBody.content} />
      </div>
      <Link to={`/user/${data.question.questionBody.authorID}`}>
        글쓴이: {data.question.questionBody.authorNickname}
      </Link>
      <div className="hashtags">
        {data.question.questionBody.hashtags.map((tag, index) => {
          return (
            <div key={index}>
              해시태그{index}:{' '}
              <TagBlock
                text={tag}
                function={() => {
                  alert('tag clicked!')
                }}
              />
            </div>
          )
        })}
      </div>
      {data.question.questionBody.authorID === userID &&
      data.answers.length === 0 &&
      userID !== '000000000000000000000000' ? (
        <>
          <button>
            <Link to={`/question/edit/${data.question._id}`}>
              question 수정하기
            </Link>
          </button>
          <button onClick={onDeleteQuestion}>question 삭제하기</button>
        </>
      ) : (
        ''
      )}

      {/*<CommentListBlock commentList={question.comments} />*/}

      <MarkdownEditorBlock
        initialContent={''}
        onChangeContentProps={onChangeContent}
      />
      <button onClick={onSubmitComment}>question 에 댓글달기</button>
    </>
  )
})
