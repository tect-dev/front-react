import React, { useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { useSelector } from 'react-redux';
import QuestionWriteBlock from '../../components/question/WriteBlock';

export default function QuestionWritePage({ history }) {
  //useEffect(() => {
  //  return () => {
  //    history.block('페이지를 떠나시는건가요?');
  //  };
  //}, [history]);
  const { loginState, userInfo } = useSelector((state) => {
    return { loginState: state.auth.loginState, userInfo: state.auth.userInfo };
  });

  return (
    <>
      <MainLayout>
        {/* 마크다운 렌더되는걸 보려고 임시적으로 마진을 줬다. */}
        <div style={{ margin: '0 25px 0 25px' }}>
          <QuestionWriteBlock />
        </div>
      </MainLayout>
    </>
  );
}
