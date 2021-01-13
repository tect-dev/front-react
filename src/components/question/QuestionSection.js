import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MarkdownRenderingBlock from '../MarkdownRenderingBlock';
import CommentListBlock from '../CommentListBlock';
import MarkdownEditorBlock from '../MarkdownEditorBlock';
import { uid } from 'uid';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteQuestion,
  deleteAnswer,
  deleteComment,
} from '../../redux/deletePost';
export default function QuestionSection({ data }) {
  const [content, setContent] = useState('');

  function onChangeContent(e) {
    setContent(e.target.value);
  }

  const dispatch = useDispatch();

  const onDeleteQuestion = useCallback(() => {
    //alert('정말 삭제합니까?');
    dispatch(deleteQuestion(data.question._id));
    window.location.href = `/question`;
  }, [dispatch]);
  function deleteComment() {
    alert('정말 삭제합니까?');
  }

  const onSubmitComment = useCallback(
    async (e) => {
      e.preventDefault();
      if (!content) {
        return;
      }
      const formData = new FormData();
      const uid24 = uid(24);
      formData.append('postID', uid24);
      formData.append('contentType', 'question');
      formData.append('content', content);
      formData.append('authorID', '123456789012345678901234');
      formData.append('authorNickname', '임시닉네임');
      //if (userInfo.userUID) {
      //  formData.append('authorID', userInfo.userUID);
      //  formData.append('authorNickname', userInfo.userUID);
      //} else {
      //  formData.append('authorID', '비회원 글쓰기');
      //  formData.append('authorNickname', '임시닉네임');
      //}

      //dispatch(createQuestion(formData));
    },
    [content]
  );

  return (
    <>
      <div className="title">Title: {data.question.questionBody.title}</div>
      <div className="content">
        <MarkdownRenderingBlock content={data.question.questionBody.content} />
      </div>
      <div className="hashtags">
        {data.question.questionBody.hashtags.map((tag, index) => {
          return (
            <div key={index}>
              해시태그{index}: {tag}
            </div>
          );
        })}
      </div>
      <button>
        <Link to={`/question/edit/${data.question._id}`}>
          question 수정하기
        </Link>
      </button>
      <button onClick={onDeleteQuestion}>question 삭제하기</button>
      {/*<CommentListBlock commentList={question.comments} />*/}

      <MarkdownEditorBlock
        initialContent={''}
        onChangeContentProps={onChangeContent}
      />
      <button onClick={onSubmitComment}>question 에 댓글달기</button>
    </>
  );
}
