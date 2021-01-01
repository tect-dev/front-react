import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { readQuestionByUID } from '../../redux/readPost';
import MainLayout from '../../components/MainLayout';

export default function QuestionDetailPage({ match }) {
  const { questionUID } = match.params;
  const { loading, data, error } = useSelector((state) => {
    return state.post.post;
  });

  const dispatch = useDispatch();

  //const getPostAsync = useCallback(() => {
  //  dispatch(readQuestionByUID(questionID));
  //}, [dispatch]);

  useEffect(() => {
    dispatch(readQuestionByUID(questionUID));
  }, [dispatch]);

  if (loading)
    return (
      <MainLayout>
        <div>로딩중...</div>
      </MainLayout>
    );

  if (error) {
    return (
      <>
        <h2>error..</h2>
      </>
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
      </MainLayout>
    </>
  );
}
