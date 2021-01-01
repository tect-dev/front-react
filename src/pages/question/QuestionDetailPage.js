import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { readQuestionByUID } from '../../redux/readPost';
import MainLayout from '../../components/MainLayout';
import AnswerWriteBlock from '../../components/question/AnswerWriteBlock';

export default function QuestionDetailPage({ match }) {
  const { questionUID } = match.params;
  const { loading, data, error } = useSelector((state) => {
    return state.readPost.question;
  });

  const dispatch = useDispatch();

  //const getPostAsync = useCallback(() => {
  //  dispatch(readQuestionByUID(questionID));
  //}, [dispatch]);
  const getQuestionAsync = useCallback(() => {
    dispatch(readQuestionByUID(questionUID));
  }, [dispatch]);

  useEffect(() => {
    getQuestionAsync();
  }, [dispatch]);

  if (loading)
    return (
      <MainLayout>
        <div>로딩중...</div>
      </MainLayout>
    );

  if (error) {
    return (
      <MainLayout>
        <div>error...</div>
      </MainLayout>
    );
  }
  if (!data)
    return (
      <>
        <MainLayout>no data</MainLayout>
      </>
    );
  return (
    <>
      <MainLayout>
        <h2>params: {questionUID}</h2>
        {data ? <h2>title: {data.title}</h2> : ''}
        <AnswerWriteBlock questionUID={questionUID} />
      </MainLayout>
    </>
  );
}
