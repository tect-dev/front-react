import React, { useEffect, useState, useLayoutEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import TechtreeDetailPage from './pages/techtree/TechtreeDetailPage'
import TechtreeListPage from './pages/techtree/TechtreeListPage'

import AboutPage from './pages/AboutPage'
import QuestionListPage from './pages/question/QuestionListPage'
import QuestionWritePage from './pages/question/QuestionWritePage'
import QuestionEditPage from './pages/question/QuestionEditPage'
import QuestionDetailPage from './pages/question/QuestionDetailPage'
import QuestionSearchResultPage from './pages/question/QuestionSearchResultPage'
import ProfilePage from './pages/user/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import ErrorBoundary from './ErrorBoundary'
import './App.css'
import { useSelector, useDispatch } from 'react-redux'
import { checkAuth } from './redux/auth'
import { authService } from './lib/firebase'

function App() {
  const dispatch = useDispatch()

  const { loginState } = useSelector((state) => {
    return { loginState: state.auth.loginState }
  })

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        dispatch(checkAuth(user))
      } else {
        dispatch(checkAuth(user))
      }
    })
  }, [])

  return (
    <>
      {/* head 파일을 여기다 적으면, index.html 의 body 태그 하위로 들어가는듯. 그래서 콘솔이 에러를 낸다. react helmet 같은 라이브러리를 써야할듯 */}

      {/* 라우트를 Switch 로 감싸면, 매칭되는 첫번째 페이지만 렌더를 해준다. */}
      <ErrorBoundary>
        <Switch>
          <Route path="/" exact={true} component={TechtreeListPage} />
          <Route path="/techtree/:techtreeID" component={TechtreeDetailPage} />
          <Route path="/about" exact={true} component={AboutPage} />
          <Route path="/user/:userID" component={ProfilePage} />

          <Route path="/mypage" component={ProfilePage} />

          <Route path="/question/list/:page" component={QuestionListPage} />
          <Route
            path="/question/write"
            exact={true}
            component={QuestionWritePage}
          />
          <Route
            path="/question/edit/:questionID"
            component={QuestionEditPage}
          />
          <Route
            path="/searched/:searchValue/:page"
            component={QuestionSearchResultPage}
          />
          <Route path="/question/:questionID" component={QuestionDetailPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </ErrorBoundary>
    </>
  )
}

export default App
