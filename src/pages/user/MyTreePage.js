import React, { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import '../../styles/page/user/ProfilePage.scss'
import { useSelector, useDispatch } from 'react-redux'
import { logout, getUserInfo } from '../../redux/auth'
import styled from 'styled-components'
import { Spinner } from '../../components/Spinner'
import { Button } from '../../components/Button'
import TreeIcon from '../../assets/tree.svg'
import MainWrapper from '../../wrappers/MainWrapper'
import { GridWrapper } from '../../wrappers/GridWrapper'
import TechtreeThumbnail from '../../components/TechtreeThumbnail'
import {
  TechtreeThumbnailCard,
  TechtreeInfo,
  TechtreeThumbnailBlock,
  TechtreeThumbnailImage,
} from '../../components/TechtreeThumbnail'

import { createTechtree, readTechtreeList } from '../../redux/techtree'
import { sortISOByTimeStamp } from '../../lib/functions'

export default function MyTreePage({ match }) {
  const history = useHistory()
  const { userID } = match.params
  const { myID, loading, loginState } = useSelector((state) => {
    return {
      myID: state.auth.userID,
      loading: state.auth.loading,
      loginState: state.auth.loginState,
    }
  })
  const { treeData } = useSelector((state) => {
    return {
      treeData: state.auth.userData.treeData.sort((a, b) => {
        return sortISOByTimeStamp(a.createdAt, b.createdAt, 1)
      }),
    }
  })

  const dispatch = useDispatch()

  const onClickLogout = useCallback(() => {
    dispatch(logout())
    history.push('/')
  }, [dispatch])

  useEffect(() => {
    dispatch(getUserInfo(userID))
  }, [dispatch])

  if (loading) {
    return (
      <MainWrapper>
        <Spinner />
      </MainWrapper>
    )
  }
  return (
    <MainWrapper>
      <GridWrapper>
        {loginState ? (
          <TechtreeThumbnailCard
            onClick={() => {
              if (loginState) {
                dispatch(createTechtree())
              } else {
                alert('로그인이 필요해요')
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <TechtreeThumbnailBlock>
              <TechtreeThumbnailImage src={TreeIcon} alt="treeIcon" />
            </TechtreeThumbnailBlock>
            <TechtreeInfo>
              <div style={{ margin: 'auto' }}> 새로운 트리 심기</div>
            </TechtreeInfo>
          </TechtreeThumbnailCard>
        ) : (
          ''
        )}

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
      </GridWrapper>
    </MainWrapper>
  )
}
