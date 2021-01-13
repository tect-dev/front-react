import { useState } from 'react';
import MarkdownRenderingBlock from '../MarkdownRenderingBlock';
import CommentListBlock from '../CommentListBlock';
import MarkdownEditorBlock from '../MarkdownEditorBlock';
import { createAnswer } from '../../redux/createPost';
import { useDispatch } from 'react-redux';
import { uid } from 'uid';

export default function AnswerSection({ data }) {
  const [content, setContent] = useState('');
  const dispatch = useDispatch();

  function onChangeContent(e) {
    setContent(e.target.value);
  }

  function addAnswer(e) {
    e.preventDefault();
    if (!content) {
      return alert('게시글을 작성하세요.');
    }
    const formData = new FormData();
    const uid24 = uid(24);
    formData.append('contentType', 'answer');
    formData.append('postID', data.question._id);
    formData.append('answerID', uid24);
    formData.append('content', content);
    formData.append('authorNickname', '임시닉네임');
    formData.append('authorID', '123456789012345678901234');

    dispatch(createAnswer(formData));
  }

  return (
    <>
      {data.answers.map((element, index) => {
        return (
          <div key={index}>
            <div className="content">
              answer{index}
              <MarkdownRenderingBlock content={element.answerBody.content} />
            </div>

            {/* <CommentListBlock commentList={element.answerBody.comments} /> */}
            <MarkdownEditorBlock />
            <button>answer에 댓글달기</button>
          </div>
        );
      })}

      <MarkdownEditorBlock
        className="answerWrite"
        onChangeContentProps={onChangeContent}
      />
      <button onClick={addAnswer}>answer 추가하기</button>
    </>
  );
}
