import React, { useCallback, useState } from 'react';
import { uid } from 'uid';
import { useInput } from '../../hooks/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { createQuestion } from '../../redux/createPost';
import MarkdownRenderingBlock from './MarkdownRenderingBlock';

export default function WriteBlock() {
  const { loginState, userInfo } = useSelector((state) => {
    return { loginState: state.auth.loginState, userInfo: state.auth.userInfo };
  });
  const [title, onChangeTitle] = useInput();
  const [content, onChangeContent] = useInput();
  const [hashtagText, setHashtagText] = useState('');
  const [hashtagList, setHashtagList] = useState([]);

  const dispatch = useDispatch();

  const onChangeHashtagText = useCallback((e) => {
    setHashtagText(e.target.value);
    // 정규식으로 해시태그를 해시태그 리스트에 푸시, 또는 제거.
    // 해시태그 인식할때 마다 해당 해시태그가 아이콘화 하는것도 구현하면 좋겠다.
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
      formData.append('hashtags', hashtagList);

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
      <section>
        <form onSubmit={onSubmitForm}>
          <div>
            <label htmlFor="title">title: </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={onChangeTitle}
            />
          </div>
          <div>
            <label htmlFor="content">content: </label>
            <textarea
              id="content"
              value={content}
              onChange={onChangeContent}
            ></textarea>
          </div>
          <div>
            <label htmlFor="hashtag">hashtag: </label>
            <input
              type="text"
              id="hashtag"
              value={hashtagText}
              onChange={onChangeHashtagText}
            />
          </div>

          <div className="button">
            <button type="submit">Send your message</button>
          </div>
        </form>
      </section>
      <section>
        <div id="preview">
          <div>Preview</div>
          <MarkdownRenderingBlock content={content} />
        </div>
      </section>
    </>
  );
}
