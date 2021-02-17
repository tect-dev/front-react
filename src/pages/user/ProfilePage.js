import React, {
  useCallback,
  useDebugValue,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import '../../styles/page/user/ProfilePage.scss'
import { useSelector, useDispatch } from 'react-redux'
import { logout, getUserInfo, updateProfile } from '../../redux/auth'
import styled from 'styled-components'
import { Spinner } from '../../components/Spinner'
import { Button } from '../../components/Button'
import MainWrapper from '../../wrappers/MainWrapper'
import TechtreeThumbnail from '../../components/TechtreeThumbnail'

import { sortISOByTimeStamp } from '../../lib/functions'

export default function ProfilePage({ match }) {
  const history = useHistory()
  const { userID } = match.params
  const { myID, loading } = useSelector((state) => {
    return {
      myID: state.auth.userID,
      loading: state.auth.loading,
    }
  })
  const { treeData } = useSelector((state) => {
    return {
      treeData: state.auth.userData.treeData.sort((a, b) => {
        return sortISOByTimeStamp(a.createdAt, b.createdAt, 1)
      }),
    }
  })

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
    (e) => {
      e.preventDefault()
      dispatch(updateProfile(myID, displayName, introduce))
    },
    [myID, displayName, introduce]
  )

  useEffect(() => {
    dispatch(getUserInfo(userID))
  }, [dispatch, userID])

  if (loading) {
    return (
      <MainWrapper>
        <Spinner />
      </MainWrapper>
    )
  }
  return (
    <MainWrapper>
      <input value={displayName} onChange={onChangeDisplayName} />
      <input value={introduce} onChange={onChangeIntroduce} />
      <button onClick={submitProfile}>자기소개 수정</button>
      <GridContainer>
        {treeData?.map((techtreeData, index) => {
          const parsedNodeList = JSON.parse(techtreeData.nodeList)
          const parsedLinkList = JSON.parse(techtreeData.linkList)
          return (
            <TechtreeThumbnail
              nodeList={parsedNodeList}
              linkList={parsedLinkList}
              techtreeTitle={techtreeData.title}
              techtreeID={techtreeData._id}
              techtreeData={techtreeData}
              key={index}
            />
          )
        })}
        {myID === userID ? (
          <Button
            onClick={() => {
              dispatch(logout())
            }}
          >
            로그아웃
          </Button>
        ) : (
          ''
        )}
      </GridContainer>
    </MainWrapper>
  )
}

const GridContainer = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 25px;
  align-items: center; // 세로축에서 중앙정렬
  justify-items: center; // 가로축에서 중앙정렬

  @media (max-width: 1440px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`
