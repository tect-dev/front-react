import React from 'react';
import MainLayout from '../../components/MainLayout';

export default function QuestionDetailPage({ match }) {
  const { questionID } = match.params;

  if (!questionID) {
    return (
      <>
        <h2>no one..</h2>
      </>
    );
  }

  return (
    <>
      <MainLayout>
        <h2>params: {questionID}</h2>
      </MainLayout>
    </>
  );
}
