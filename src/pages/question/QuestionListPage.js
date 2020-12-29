import React from 'react';
import MainLayout from '../../components/MainLayout';

export default function QuestionListPage() {
  return (
    <>
      <MainLayout>
        <h2>question List</h2>
        <button
          onClick={() => {
            window.location.href = '/question/write';
          }}
        >
          글쓰기
        </button>
      </MainLayout>
    </>
  );
}
