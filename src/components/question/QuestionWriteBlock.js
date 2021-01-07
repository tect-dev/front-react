import React, { useCallback, useState } from 'react';
import { uid } from 'uid';

import { useInput } from '../../hooks/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { createQuestion } from '../../redux/createPost';
import MarkdownPreviewBlock from './MarkdownPreviewBlock';

export default function QuestionWriteBlock() {
  const { loginState, userInfo } = useSelector((state) => {
    return { loginState: state.auth.loginState, userInfo: state.auth.userInfo };
  });
  const [title, onChangeTitle] = useInput();
  //const [content, onChangeContent] = useInput('$\\frac{v^{2}}{2}$');
  const [content, setContent] = useState();

  const dispatch = useDispatch();

  const onChangeContent = useCallback((e) => {
    setContent(e.target.value);
  }, []);

  const onSubmitForm = useCallback(
    async (e) => {
      e.preventDefault();
      if (!title || !content) {
        return alert('게시글을 작성하세요.');
      }
      const formData = new FormData();
      const uid24 = uid(24);
      formData.append('postID', uid24);
      formData.append('contentType', 'question');
      formData.append('title', title);
      formData.append('content', content);
      formData.append('authorID', '123456789012345678901234');
      formData.append('authorNickname', '임시닉네임');
      formData.append('hashtags', []);

      //if (userInfo.userUID) {
      //  formData.append('authorID', userInfo.userUID);
      //  formData.append('authorNickname', userInfo.userUID);
      //} else {
      //  formData.append('authorID', '비회원 글쓰기');
      //  formData.append('authorNickname', '임시닉네임');
      //}
      dispatch(createQuestion(formData));
    },
    [title, content]
  );

  return (
    <>
      <form onSubmit={onSubmitForm}>
        <div>
          <label htmlFor="title">title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={onChangeTitle}
          />
        </div>
        <div>
          <label htmlFor="content">content:</label>
          <textarea
            id="content"
            value={content}
            onChange={onChangeContent}
          ></textarea>
        </div>
        <div id="preview">
          <div>{content} : content in write block</div>
          <MarkdownPreviewBlock content={content} />
          {
            //unified()
            //  .use(parse)
            //  .use(math)
            //  .use(remark2rehype)
            //  .use(katex)
            //  .use(remark2react)
            //  .processSync(content).result
          }
        </div>
        <div className="button">
          <button type="submit">Send your message</button>
        </div>
      </form>
    </>
  );
}
