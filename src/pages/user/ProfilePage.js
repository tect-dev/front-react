import React, {
  useCallback,
  useDebugValue,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useHistory, Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import '../../styles/page/user/ProfilePage.scss'
import { useSelector, useDispatch } from 'react-redux'
import { logout, getUserInfo, updateProfile } from '../../redux/auth'
import styled from 'styled-components'
import { Spinner } from '../../components/Spinner'
// import { Button } from '../../components/Button'
import MainWrapper from '../../wrappers/MainWrapper'
import TechtreeThumbnail from '../../components/TechtreeThumbnail'
import { fontSize, AnonymousSVG } from '../../lib/constants'

import { sortISOByTimeStamp } from '../../lib/functions'
import { authService } from '../../lib/firebase'

export default function ProfilePage({ match }) {
  const history = useHistory()
  const { userID } = match.params
  const {
    compareID,
    myID,
    myIntroduce,
    myDisplayName,
    myPosts,
    loading,
    emailVerified,
  } = useSelector((state) => {
    return {
      compareID: state.auth.userData?.firebaseUid,
      myID: state.auth.userID,
      myIntroduce: state.auth.userData.introduce,
      myDisplayName: state.auth.userData.displayName,
      myPosts: state.auth.userData.posts?.question,
      loading: state.auth.loading,
      emailVerified: state.auth.emailVerified,
    }
  })

  const [isEdit, setIsEdit] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [introduce, setIntroduce] = useState('')

  const dispatch = useDispatch()

  const onClickLogout = useCallback(() => {
    dispatch(logout())
    history.push('/')
  }, [dispatch])

  const onChangeDisplayName = useCallback(
    (e) => {
      setDisplayName(e.target.value)
    },
    [displayName]
  )

  const onChangeIntroduce = useCallback(
    (e) => {
      setIntroduce(e.target.value)
    },
    [introduce]
  )

  const submitProfile = useCallback(
    async (e) => {
      e.preventDefault()
      setIsEdit(false)
      await dispatch(updateProfile(myID, displayName, introduce))
    },
    [myID, displayName, introduce]
  )

  useEffect(() => {
    dispatch(getUserInfo(userID))
  }, [dispatch, userID])

  useEffect(() => {
    setDisplayName(myDisplayName)
    setIntroduce(myIntroduce)
  }, [myDisplayName, myIntroduce])

  if (loading) {
    return (
      <MainWrapper>
        <Spinner />
      </MainWrapper>
    )
  }
  return (
    <MainWrapper>
      <MyPageContainer>
        <Title>MyPage</Title>
        <MyPageHead>
          <AnonymousSVG />
          {isEdit ? (
            <DisplayName_Input
              value={displayName}
              onChange={onChangeDisplayName}
            />
          ) : (
            <DisplayName>{displayName}</DisplayName>
          )}
        </MyPageHead>
        {isEdit ? (
          <IntroduceInput value={introduce} onChange={onChangeIntroduce} />
        ) : (
          <Introduce>{introduce}</Introduce>
        )}

{/*    {isEdit ? (
          <Button onClick={submitProfile}>수정완료</Button>
        ) : (
          <Button
            onClick={() => {
              setIsEdit(true)
            }}
          >
            자기소개 수정
          </Button>
        )}*/}
    

        {!emailVerified ? (
          <Button
            onClick={() => {
              authService.currentUser.sendEmailVerification().then(()=>{
                alert('인증메일이 발송됐습니다! 메일함을 확인해 주세요.')
              })
            }}
          >
            인증메일 다시 보내기
          </Button>
        ) : (
          ''
        )}
      </MyPageContainer>
      <BoardContainer>
        <BoardTitle>작성게시물</BoardTitle>
        <PostsContainer>
          {myPosts?.map((post) => {
            return (
              <Link to={`/post/${post._id}`}>
                <PostTitle>{post.title}</PostTitle>
              </Link>
            )
          })}
        </PostsContainer>
      </BoardContainer>

      <ButtonContainer>
        <Tree_Button
          onClick={() => {
            history.push(`/forest/${compareID}`)
          }}
        >
          {displayName}의 Forest
        </Tree_Button>
        {myID === compareID ? (
          <Logout_Button
            onClick={() => {
              dispatch(logout())
              history.push('/')
            }}
          >
            로그아웃
          </Logout_Button>
        ) : (
          ''
        )}
      </ButtonContainer>
    </MainWrapper>
  )
}

// const GridContainer = styled.div`
//   display: grid;

//   grid-template-columns: 1fr 1fr 1fr 1fr;
//   grid-gap: 25px;
//   align-items: center; // 세로축에서 중앙정렬
//   justify-items: center; // 가로축에서 중앙정렬

//   @media (max-width: 1440px) {
//     grid-template-columns: 1fr 1fr 1fr;
//   }
//   @media (max-width: 1024px) {
//     grid-template-columns: 1fr 1fr;
//   }
//   @media (max-width: 650px) {
//     grid-template-columns: 1fr;
//   }
// `

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`
const MyPageContainer = styled.div`
  background: #fffef8;
  border-radius: 22px 22px 0px 0px;
  border: 1px solid #6d9b7b;
  padding: 30px;
  margin-bottom: 10px;
`

const MyPageHead = styled.div`
  display: flex;
  margin-bottom: 50px;
`

const Title = styled.div`
  font-size: ${fontSize.large};
  font-weight: bold;
  color: #707070;
  margin-bottom: 66px;
`

const DisplayName = styled.div`
  display: flex;
  align-items: center;
  margin-left: 30px;
  font-size: ${fontSize.medium};
  font-weight: bold;
  color: #707070;
`

const Introduce = styled.div`
  font-size: ${fontSize.small};
  color: #6d9b7b;
  font-weight: lighter;
  margin-bottom: 30px;
`

const BoardContainer = styled.div`
  background: #fffef8;
  border-radius: 0px 0px 22px 22px;
  border: 1px solid #6d9b7b;
  padding: 30px 0px;
  margin-bottom: 80px;
`

const BoardTitle = styled.div`
  box-sizing: border-box;
  border-bottom: 0.5px solid #6d9b7b;
  box-shadow: 0 3px 6px -6px #6d9b7b;
  padding: 0px 30px 30px 30px;
  margin-bottom: 50px;
  color: #6d9b7b;
  font-size: ${fontSize.small};
  font-weight: bold;
`

const Button = styled.button`
  all: unset;
  display: block;
  border-radius: 10px;
  border: 1px solid #6d9b7b;
  padding: 8px 13px;
  cursor: pointer;
  font-size: ${fontSize.small};
  transition: all ease 0.4s;
  color: #6d9b7b;
  background: #fffef8;
  &:hover {
    color: #fffef8;
    background: #6d9b7b;
    transition: all ease 0.4s;
  }
`

const Tree_Button = styled(Button)`
  margin-left: 30px;
`

const Logout_Button = styled(Button)`
  margin-right: 30px;
`

const Input = styled.input`
  all: unset;
  width: 100%;
  display: block;
`
const IntroduceInput = styled(Input)`
  margin-bottom: 30px;
  font-weight: lighter;
`

const DisplayName_Input = styled(Input)`
  color: black;
  margin-left: 30px;
  font-weight: bold;
`

const PostsContainer = styled.div`
  padding: 0px 30px;
`

const PostTitle = styled.div`
  font-size: ${fontSize.small};
  color: #767676;
  margin-bottom: 35px;

  transition: all ease 0.4s;

  &:hover {
    color: #6d9b7b;
    transition: all ease 0.4s;
  }
`
