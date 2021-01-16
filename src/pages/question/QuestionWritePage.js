import React, { useEffect, useCallback, useState } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import QuestionWriteSection from '../../components/question/QuestionWriteSection'

export default function QuestionWritePage({ history }) {
  //useEffect(() => {
  //  return () => {
  //    history.block('페이지를 떠나시는건가요?');
  //  };
  //}, [history]);

  return (
    <MainLayout>
      <QuestionWriteSection />
    </MainLayout>
  )
}
