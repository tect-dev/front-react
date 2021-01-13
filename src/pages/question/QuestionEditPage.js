import React, { useEffect, useCallback, useState } from 'react';
import { useInput } from '../../hooks/hooks';
import MainLayout from '../../components/layout/MainLayout';
import { useSelector, useDispatch } from 'react-redux';
import MarkdownRenderingBlock from '../../components/MarkdownRenderingBlock';
import QuestionWriteSection from '../../components/question/QuestionWriteSection';
import { uid } from 'uid';

export default function QuestionWritePage({ history }) {
  const { data, content } = useSelector((state) => {
    return {
      data: state.readPost.question.data,
      content: state.createPost.content,
    };
  });
  //useEffect(() => {
  //  return () => {
  //    history.block('페이지를 떠나시는건가요?');
  //  };
  //}, [history]);

  const [title, onChangeTitle] = useInput(data.question.questionBody.title);

  const [hashtagText, setHashtagText] = useState('');
  const [hashtagList, setHashtagList] = useState([]);

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
    },
    [title, content]
  );

  return (
    <MainLayout>
      <section>
        <QuestionWriteSection initialContent={data.question} />
      </section>
      <section>
        <div id="preview">
          <div>Preview</div>
          <MarkdownRenderingBlock content={content} />
        </div>
      </section>
    </MainLayout>
  );
}
