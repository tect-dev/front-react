import React, { useEffect, useCallback, useState } from 'react';
import { Prompt } from 'react-router-dom';
import { useInput } from '../../hooks/hooks';
import MainLayout from '../../components/layout/MainLayout';
import { useSelector, useDispatch } from 'react-redux';
import MarkdownRenderingBlock from '../../components/MarkdownRenderingBlock';
import QuestionWriteSection from '../../components/question/QuestionWriteSection';
import { uid } from 'uid';

export default function QuestionWritePage({ history }) {
  //useEffect(() => {
  //  return () => {
  //    history.block('페이지를 떠나시는건가요?');
  //  };
  //}, [history]);

  return (
    <MainLayout>
      <section>
        <QuestionWriteSection />
      </section>
    </MainLayout>
  );
}
