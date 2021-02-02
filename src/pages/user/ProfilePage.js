import React, { useCallback, useDebugValue, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import '../../styles/page/user/ProfilePage.scss'
import { useSelector, useDispatch } from 'react-redux'
import { logout, getUserInfo } from '../../redux/auth'
import { interpolateViridis } from 'd3'
import styled from 'styled-components'
import { Spinner } from '../../components/Spinner'


const InfoCell = styled.div`
  display: flex;
  justify-content: space-between;
`

export default function ProfilePage({ match }) {
  const history = useHistory()
  const { userID } = match.params
  const { myID, myDisplayName, myCreatedAt, myPoints, myEmail, myPosts, loading } = useSelector((state) => {
    console.log(state.auth)
    return { 
      myID: state.auth.userID, 
      myDisplayName: state.auth.displayName,
      myCreatedAt: state.auth.createdAt,
      myPoints: state.auth.points,
      myEmail: state.auth.email,
      myPosts: state.auth.posts,
      loading: state.auth.loading
    }
  })
  const [isValid, setIsValid] = useState( userID === myID )

  // reload 대비
  // Invalid Access에 대해서는 빈 화면을 출력한다.
  if(!isValid && userID === myID){
    setIsValid(true)
  }

  const dispatch = useDispatch()

  const onClickLogout = useCallback(() => {
    dispatch(logout())
    history.push('/')
  }, [dispatch])

  useEffect(() => {
    if(isValid){
      dispatch(getUserInfo())
    }
  }, [dispatch, isValid])

  const showDate = (myCreatedAt) => {
    const yyyymmdd = myCreatedAt.split('T')[0]
    const [ yyyy, mm, dd ] = yyyymmdd.split('-')
    return `${yyyy}년 ${mm}월 ${dd}일`
  }

  if(loading){
    return (
      <MainLayout>
        <Spinner />
      </MainLayout>
    )
  }
  return (
    <>
    {isValid &&
    <MainLayout>
      <div className="profile-container">
        <div className="profile-upside">
          <div className="profile-photo">
            <img src="https://media.vlpt.us/images/ghkdwltjq98/profile/b7b493c6-69ef-4886-aec6-16d03800306e/social.png?w=120" />
          </div>
          <div className="intro-container">
            <InfoCell>
              <div>닉네임</div><div>{myDisplayName}</div>
            </InfoCell>
            <InfoCell>
              <div>이메일</div><div>{myEmail}</div>
            </InfoCell>
            <InfoCell>
              <div>연락처</div>
            </InfoCell>
            <InfoCell>
              <div>가입일자</div><div>{myCreatedAt ? showDate(myCreatedAt) : null}</div>
            </InfoCell>
            <InfoCell>
              <div>마지막 접속일</div>
            </InfoCell>
            <InfoCell>
              <div>인증연동</div>
            </InfoCell>
            <InfoCell>
              <div>포인트</div><div>{myPoints}</div>
            </InfoCell>
            {myID === userID ? (
              <button onClick={onClickLogout}>Logout</button>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="profile-downside">
          <div className="profile-card">Questions (0)</div>
          <div className="profile-card">Answers (0)</div>
          <div className="profile-card">Free Posts (0)</div>
        </div>
      </div>
    </MainLayout>
    }
      
    </>
  )
}
