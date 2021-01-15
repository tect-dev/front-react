import React, { useState, useCallback, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import MarkdownRenderingBlock from '../MarkdownRenderingBlock'
import CommentListBlock from '../CommentListBlock'
import MarkdownEditorBlock from '../MarkdownEditorBlock'
import { uid } from 'uid'
import { useSelector, useDispatch } from 'react-redux'
import {
  deleteQuestion,
  deleteAnswer,
  deleteComment,
} from '../../redux/deletePost'

export default React.memo(function QuestionSection({ data }) {
  const [content, setContent] = useState('')
  const { isDeleted, userID } = useSelector((state) => {
    return { isDeleted: state.deletePost.isDeleted, userID: state.auth.userID }
  }) || { isDeleted: false, userID: null }
  const history = useHistory()
  function onChangeContent(e) {
    setContent(e.target.value)
  }

  useEffect(() => {
    if (isDeleted) {
      history.push('/question')
    }
  }, [isDeleted])

  const dispatch = useDispatch()

  const onDeleteQuestion = useCallback(() => {
    //alert('정말 삭제합니까?');
    dispatch(deleteQuestion(data.question._id))
  }, [dispatch, data.question._id])

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
      //if (userInfo.userUID) {
      //  formData.append('authorID', userInfo.userUID);
      //  formData.append('authorNickname', userInfo.userUID);
      //} else {
      //  formData.append('authorID', '비회원 글쓰기');
      //  formData.append('authorNickname', '임시닉네임');
      //}

      //dispatch(createComment(formData));
    },
    [content]
  )

  return (
    <>
      <div className="title">Title: {data.question.questionBody.title}</div>
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
              해시태그{index}: {tag}
            </div>
          )
        })}
      </div>
      {data.question.questionBody.authorID === userID ? (
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
