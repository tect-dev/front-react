import React, { useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { useSelector } from 'react-redux';
import QuestionWriteBlock from '../../components/question/QuestionWriteBlock';

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
        <QuestionWriteBlock />
      </MainLayout>
    </>
  );
}
