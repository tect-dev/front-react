import React, { useCallback } from 'react';

import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';

import { useInput } from '../../hooks/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { createQuestion } from '../../redux/createPost';

export default function QuestionWriteBlock() {
  const { loginState, userInfo } = useSelector((state) => {
    return { loginState: state.auth.loginState, userInfo: state.auth.userInfo };
  });
  const [title, onChangeTitle] = useInput();
  const [content, onChangeContent] = useInput();

  const dispatch = useDispatch();

  const onSubmitForm = useCallback(() => {
    if (!title || !content) {
      return alert('게시글을 작성하세요.');
    }
    const formData = new FormData();
    formData.append('contentType', 'question');
    formData.append('title', title);
    formData.append('content', content);
    if (userInfo.userUID) {
      formData.append('authorUID', userInfo.userUID);
    } else {
      formData.append('authorUID', '비회원 글쓰기');
    }
    dispatch(createQuestion(formData));
  }, [title, content]);

  return (
    <>
      {' '}
      <form onSubmit={onSubmitForm}>
        <div>
          <label for="title">title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={onChangeTitle}
          />
        </div>
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
