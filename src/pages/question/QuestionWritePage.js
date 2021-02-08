import React, { useEffect, useCallback, useState } from 'react'
import QuestionWriteSection from '../../components/question/QuestionWriteSection'
import DoublesideLayout from '../../components/layout/DoublesideLayout'

export default function QuestionWritePage({ history }) {
  //useEffect(() => {
  //  return () => {
  //    history.block('페이지를 떠나시는건가요?');
  //  };
  //}, [history]);

  return (
    <DoublesideLayout>
      <QuestionWriteSection />
    </DoublesideLayout>
  )
}
