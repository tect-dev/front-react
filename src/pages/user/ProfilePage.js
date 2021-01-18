import React, { useCallback, useDebugValue } from 'react'
import MainLayout from '../../components/layout/MainLayout'
import '../../styles/page/user/ProfilePage.scss'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/auth'

export default function ProfilePage({ match }) {
  const { userID } = match.params
  const { myID, myNickname } = useSelector((state) => {
    return { myID: state.auth.userID, myNickname: state.auth.userNickname }
  })
  const dispatch = useDispatch()

  const onClickLogout = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  return (
    <>
      <MainLayout>
        <div className="profile-container">
          <div className="profile-upside">
            <div className="profile-photo">
              <img src="https://media.vlpt.us/images/ghkdwltjq98/profile/b7b493c6-69ef-4886-aec6-16d03800306e/social.png?w=120" />
            </div>
            <div className="intro-container">
              <div>{userID} 닉네임</div>
              <div>이메일</div>
              <div>연락처</div>
              <div>가입일시</div>
              <div>마지막 접속일</div>
              <div>인증 연동</div>
              <div>포인트</div>
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
    </>
  )
}
