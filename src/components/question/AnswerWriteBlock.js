import React, { useEffect, useCallback } from 'react';
import { uid } from 'uid';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import { useInput } from '../../hooks/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { createAnswer } from '../../redux/createPost';

export default function AnswerWriteBlock({ questionUID }) {
  const { loginState, userInfo } = useSelector((state) => {
    return { loginState: state.auth.loginState, userInfo: state.auth.userInfo };
  });

  const [content, onChangeContent] = useInput();

  const dispatch = useDispatch();

  const onSubmitForm = useCallback(() => {
    if (!content) {
      return alert('게시글을 작성하세요.');
    }
    const formData = new FormData();
    const uid24 = uid(24);
    formData.append('postUID', uid24);
    formData.append('contentType', 'answer');
    formData.append('content', content);
    formData.append('answerOf', questionUID);
    if (userInfo.userUID) {
      formData.append('authorUID', userInfo.userUID);
    } else {
      formData.append('authorUID', '비회원 글쓰기');
    }
    dispatch(createAnswer(formData));
  }, [content]);

  return (
    <>
      <form onSubmit={onSubmitForm}>
        <div>
          <label for="content">content:</label>
          <textarea
            id="content"
            value={content}
            onChange={onChangeContent}
          ></textarea>
        </div>
        <div id="preview">
          {unified().use(parse).use(remark2react).processSync(content).result}
        </div>
        <div class="button">
          <button type="submit">Send your message</button>
        </div>
      </form>
    </>
  );
}
