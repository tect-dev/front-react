import React, { useEffect } from 'react';
import MainLayout from '../../components/MainLayout';

export default function QuestionWritePage({ history }) {
  useEffect(() => {
    return () => {
      history.block('페이지를 떠나시는건가요?');
    };
  }, [history]);

  return (
    <>
      <MainLayout>
        <h2>질문글 작성</h2>
      </MainLayout>
    </>
  );
}
