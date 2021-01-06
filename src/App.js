import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import QuestionListPage from './pages/question/QuestionListPage';
import QuestionWritePage from './pages/question/QuestionWritePage';
import QuestionDetailPage from './pages/question/QuestionDetailPage';
import ProfilePage from './pages/user/ProfilePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

export default function App() {
  return (
    <>
      <head>
        <meta name="description" content="세상 모든 테크트리, tect.dev" />
      </head>
      {/* 라우트를 Switch 로 감싸면, 매칭되는 첫번째 페이지만 렌더를 해준다. */}
      <Switch>
        <Route path="/" exact={true} component={HomePage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/user/:userID" component={ProfilePage} />

        /* 임시로 만들어 놓음. */
        <Route path="/mypage" component={ProfilePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/question" exact={true} component={QuestionListPage} />
        <Route
          path="/question/write"
          exact={true}
          component={QuestionWritePage}
        />
        <Route path="/question/:questionID" component={QuestionDetailPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </>
  );
}
