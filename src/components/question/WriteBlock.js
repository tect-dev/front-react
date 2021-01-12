import React, { useCallback, useEffect, useState } from 'react';
import { uid } from 'uid';
import { useInput } from '../../hooks/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { createQuestion } from '../../redux/createPost';
import MarkdownRenderingBlock from './MarkdownRenderingBlock';

export default function WriteBlock({ contentType, componentURL }) {
  const { loginState, userInfo } = useSelector((state) => {
    return { loginState: state.auth.loginState, userInfo: state.auth.userInfo };
  });
  const [title, onChangeTitle] = useInput();
  const [content, onChangeContent] = useInput();
  const [hashtagText, setHashtagText] = useState('');
  const [hashtagList, setHashtagList] = useState([]);
  //const hashtagPattern = /^\#[a-zA-Z0-9]+[\s\,]$/g;
  const splitPoint = /\,/g;
  const dispatch = useDispatch();

  useEffect(() => {
    if (hashtagList.length > 10) {
      setHashtagText(hashtagText.substr(0, hashtagText.length - 1));
      hashtagList.pop();
      alert('태그의 갯수가 너무 많아요!');
    }
  }, [hashtagList]);
  const onChangeHashtagText = useCallback(
    (e) => {
      setHashtagText(e.target.value);
      let splitedArray = e.target.value.split(splitPoint);
      const editedArray = splitedArray
        .map((element) => {
          return element.replace(/[^가-힣|a-z|A-Z|0-9]/g, '');
        })
        .filter((string) => string.length > 0);

      setHashtagList(editedArray);
      console.log(hashtagList);
      //console.log('hashtag List: ', hashtagPattern.exec(hashtagText));
    },
    [hashtagText]
  );

  const onSubmitForm = useCallback(
    async (e) => {
      e.preventDefault();
      if (!title || !content) {
        return alert('제목과 본문을 작성해 주세요.');
      }
      const formData = new FormData();
      const uid24 = uid(24);
      formData.append('postID', uid24);
      formData.append('contentType', 'question');
      formData.append('title', title);
      formData.append('content', content);
      formData.append('authorID', '123456789012345678901234');
      formData.append('authorNickname', '임시닉네임');
      // 해시태그는 띄어쓰기 없이, 전부 소문자로, 특수문자없이 서버단으로 보낸다.
      // 클라이언트에서 사용자의 입력은 자유롭게 받되, 서버로 보낼때 문자열을 다듬어서 보내준다.
      formData.append('hashtags', hashtagList);

      //if (userInfo.userUID) {
      //  formData.append('authorID', userInfo.userUID);
      //  formData.append('authorNickname', userInfo.userUID);
      //} else {
      //  formData.append('authorID', '비회원 글쓰기');
      //  formData.append('authorNickname', '임시닉네임');
      //}

      // 여기서 디스패치 하는 함수를, 상위 컴포넌트에서 props 로 받아오게 하자.
      // 그래야지 question, article 등등 범용성있게 쓸수있음.
      // props 로 받아온 타입에서, 타입따라 코드가 조금씩 달라지게 해야할듯. 리턴쪽에서.

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
          <div>
            hashtag가 제대로 체크 되나:{' '}
            {hashtagList.map((element, index) => {
              return (
                <div key={index}>
                  <a href="/" style={{ color: 'blue' }}>
                    {element}
                  </a>
                </div>
              );
            })}
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
