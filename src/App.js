import React, { useEffect, useState, useLayoutEffect } from 'react'
import { Route, Switch } from 'react-router-dom'

import HomePage from './pages/HomePage'
import TechtreeDetailPage from './pages/techtree/TechtreeDetailPage'
import TechtreeListPage from './pages/techtree/TechtreeListPage'

import BoardListPage from './pages/board/BoardListPage'
import PostDetailPage from './pages/board/PostDetailPage'
import WritePage from './pages/board/WritePage'
import EditPage from './pages/board/EditPage'

import AboutPage from './pages/AboutPage'

import ProfilePage from './pages/user/ProfilePage'
import MyTreePage from './pages/user/MyTreePage'
import NotFoundPage from './pages/NotFoundPage'
import ErrorBoundary from './ErrorBoundary'
import './App.css'

import { useSelector, useDispatch } from 'react-redux'
import { readTechtreeList } from './redux/techtree'
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
    dispatch(readTechtreeList(1))
  }, [dispatch])

  return (
    <>
      {/* head 파일을 여기다 적으면, index.html 의 body 태그 하위로 들어가는듯. 그래서 콘솔이 에러를 낸다. react helmet 같은 라이브러리를 써야할듯 */}

      {/* 라우트를 Switch 로 감싸면, 매칭되는 첫번째 페이지만 렌더를 해준다. */}
      <ErrorBoundary>
        <Switch>
          <Route path="/" exact={true} component={HomePage} />
          <Route path="/forest" component={TechtreeListPage} />
          <Route path="/tree/:techtreeID" component={TechtreeDetailPage} />

          <Route path="/board/:category" exact component={BoardListPage} />
          <Route path="/post/edit/:postID" exact component={EditPage} />
          <Route path="/post/:postID" exact component={PostDetailPage} />
          <Route path="/write/:category" exact component={WritePage} />

          <Route path="/about" exact={true} component={AboutPage} />
          <Route path="/user/:userID" component={ProfilePage} />
          <Route path="/forest/:userID" component={MyTreePage} />

          <Route component={NotFoundPage} />
        </Switch>
      </ErrorBoundary>
    </>
  )
}

export default App
