import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MainLayout from '../../components/MainLayout';
import { getPosts } from '../../redux/post';
import { Link } from 'react-router-dom';
import QuestionBlock from '../../components/question/QuestionBlock';

export default function QuestionListPage() {
  const { loading, data, error } = useSelector((state) => {
    return state.post.posts;
  });

  const dispatch = useDispatch();

  // useCallback : 함수의 불필요한 리렌더링을 막기 위한 hooks.
  // react 는 컴포넌트가 리렌더링되면 함수도 새로 생기는데, 반복적으로 사용하는 함수를 리렌더링 하지 않고 재사용하기 위함.
  const getPostsAsync = useCallback(() => {
    dispatch(getPosts());
  }, [dispatch]);

  useEffect(() => {
    getPostsAsync();
  }, []);

  if (loading)
    return (
      <MainLayout>
        <div>로딩중...</div>
      </MainLayout>
    );
  if (error) return <div>에러 발생!</div>;
  if (!data) return null;
  return (
    <>
      <MainLayout>
        <h2>question List</h2>
        <Link to={'/question/write'}>글쓰기</Link>
        {data && data.length > 0
          ? data.map((element) => {
              return (
                <QuestionBlock
                  key={element.id}
                  questionID={element.id}
                  title={element.title}
                />
              );
            })
          : ''}
      </MainLayout>
    </>
  );
}
