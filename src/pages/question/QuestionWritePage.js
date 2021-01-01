import React, { useEffect, useCallback } from 'react';
import ReactDom from 'react-dom';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import MainLayout from '../../components/MainLayout';
import { useInput } from '../../hooks/hooks';
import { useSelector } from 'react-redux';
//import {}

export default function QuestionWritePage({ history }) {
  //useEffect(() => {
  //  return () => {
  //    history.block('페이지를 떠나시는건가요?');
  //  };
  //}, [history]);
  const { loginState, userInfo } = useSelector((state) => {
    return { loginState: state.auth.loginState, userInfo: state.auth.userInfo };
  });
  const [title, onChangeTitle] = useInput();
  const [content, onChangeContent] = useInput();

  const onSubmitForm = useCallback(() => {
    if (!title || !content) {
      return alert('게시글을 작성하세요.');
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    //return dispatch({
    //  type: CREATE_QUESTION_TRY,
    //  data: formData,
    //});
  }, [title, content]);

  return (
    <>
      <MainLayout>
        <form action="/question/write" onSubmit={onSubmitForm}>
          <div>
            <label for="title">title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={onChangeTitle}
            />
          </div>
          {loginState ? (
            <div>
              {userInfo.nickname}
              {loginState}
            </div>
          ) : (
            ''
          )}
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
      </MainLayout>
    </>
  );
}
