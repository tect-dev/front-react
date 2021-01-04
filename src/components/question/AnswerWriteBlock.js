import React, { useEffect, useCallback } from 'react';
import { uid } from 'uid';

import { useInput } from '../../hooks/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { createAnswer } from '../../redux/createPost';
import MarkdownPreviewBlock from './MarkdownPreviewBlock';

export default function AnswerWriteBlock({ questionUID }) {
  const { loginState, userInfo } = useSelector((state) => {
    return { loginState: state.auth.loginState, userInfo: state.auth.userInfo };
  });

  const [content, onChangeContent] = useInput();

  const dispatch = useDispatch();

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (!content) {
        return alert('게시글을 작성하세요.');
      }
      const formData = new FormData();
      const uid24 = uid(24);
      formData.append('postID', uid24);
      formData.append('contentType', 'answer');
      formData.append('itIsAnswerOf', questionUID);
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
      dispatch(createAnswer(formData));
    },
    [content]
  );

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
          <MarkdownPreviewBlock content={content} />
        </div>
        <div class="button">
          <button type="submit">Send your message</button>
        </div>
      </form>
    </>
  );
}
