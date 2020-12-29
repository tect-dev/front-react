import React, { useEffect } from 'react';
import MainLayout from '../../components/MainLayout';

export default function QuestionWritePage({ history }) {
  //useEffect(() => {
  //  return () => {
  //    history.block('페이지를 떠나시는건가요?');
  //  };
  //}, [history]);

  return (
    <>
      <MainLayout>
        <form action="/question/write" method="post">
          <div>
            <label for="title">title:</label>
            <input type="text" id="title" />
          </div>

          <div>
            <label for="content">content:</label>
            <textarea id="content"></textarea>
          </div>
          <div class="button">
            <button type="submit">Send your message</button>
          </div>
        </form>
      </MainLayout>
    </>
  );
}
