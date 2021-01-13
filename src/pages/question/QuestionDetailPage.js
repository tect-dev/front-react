import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { readQuestionByUID } from '../../redux/readPost';
import MainLayout from '../../components/layout/MainLayout';
import QuestionSection from '../../components/question/QuestionSection';
import AnswerSection from '../../components/question/AnswerSection';
import AnswerWriteBlock from '../../components/question/AnswerWriteBlock';
import MarkdownRenderingBlock from '../../components/MarkdownRenderingBlock';

export default function QuestionDetailPage({ match }) {
  const questionID = match.params.questionID;
  const { loading, data, error } = useSelector((state) => {
    return state.readPost.question;
  });

  const dispatch = useDispatch();

  //const getPostAsync = useCallback(() => {
  //  dispatch(readQuestionByUID(questionID));
  //}, [dispatch]);
  const getQuestionAsync = useCallback(() => {
    dispatch(readQuestionByUID(questionID));
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
    console.log(error);
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
        <div>params: {questionID}</div>
        <div>authorID: {data.question.questionBody.authorID}</div>
        <QuestionSection data={data} />
        <AnswerSection data={data} />
        <AnswerWriteBlock questionUID={questionID} />
      </MainLayout>
    </>
  );
}
