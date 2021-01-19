import React, { useEffect, useState, useLayoutEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import QuestionListPage from './pages/question/QuestionListPage'
import QuestionWritePage from './pages/question/QuestionWritePage'
import QuestionEditPage from './pages/question/QuestionEditPage'
import QuestionDetailPage from './pages/question/QuestionDetailPage'
import QuestionSearchResultPage from './pages/question/QuestionSearchResultPage'
import ProfilePage from './pages/user/ProfilePage'
import LoginPage from './pages/LoginPage'
import TechtreeEditPage from './pages/techtree/TechtreeEditPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'
import { useSelector, useDispatch } from 'react-redux'
import { checkAuth } from './redux/auth'
import { authService, firebaseInstance } from './lib/firebase'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      console.log('호출됨: onAuthStateChanged')
      if (user) {
        console.log('user:', user)
        dispatch(checkAuth(user))
      } else {
        console.log('user가 null임')
        dispatch(checkAuth(user))
      }
    })
    const currentUser = authService.currentUser
    console.log('currentUser: ', currentUser)
  }, [])
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
        <Route path="/techtree/edit" component={TechtreeEditPage} />
        <Route path="/mypage" component={ProfilePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/question" exact={true} component={QuestionListPage} />
        <Route path="/question/write" exact={true} component={QuestionWritePage} />
        <Route path="/question/:questionID" component={QuestionDetailPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </>
  )
}
