import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPostById } from '../../redux/post';
import MainLayout from '../../components/MainLayout';

export default function QuestionDetailPage({ match }) {
  const { questionID } = match.params;
  const { loading, data, error } = useSelector((state) => {
    return state.post.post;
  });

  const dispatch = useDispatch();

  const getPostAsync = useCallback(() => {
    dispatch(getPostById(questionID));
  }, [dispatch]);

  useEffect(() => {
    getPostAsync();
    console.log('data: ', data);
  }, []);

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
  if (!data) return <>no data</>;
  return (
    <>
      <MainLayout>
        <h2>params: {questionID}</h2>
        {data ? <h2>title: {data.title}</h2> : ''}
      </MainLayout>
    </>
  );
}
