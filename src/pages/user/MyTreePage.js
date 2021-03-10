import React, { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import '../../styles/page/user/ProfilePage.scss'
import { useSelector, useDispatch } from 'react-redux'
import { logout, getUserInfo } from '../../redux/auth'

import { Spinner } from '../../components/Spinner'

import MainWrapper from '../../wrappers/MainWrapper'
import { GridWrapper } from '../../wrappers/GridWrapper'
import TechtreeThumbnail from '../../components/TechtreeThumbnail'

import { TreePageHeader } from '../techtree/TechtreeDetailPage'
import PlantNewTreeCard, {
  PlantNewTreeButton,
} from '../../components/PlantNewTreeCard'

import { authService } from '../../lib/firebase'
import { createTechtree } from '../../redux/techtree'

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
      treeData: state.auth.userTreeData,
    }
  })
  const { forestOwnerDisplayName } = useSelector((state) => {
    return {
      forestOwnerDisplayName: state.auth.userData?.displayName,
    }
  })

  const dispatch = useDispatch()

  const onClickLogout = useCallback(() => {
    dispatch(logout())
    history.push('/')
  }, [dispatch])

  useEffect(() => {
    authService.currentUser?.reload()
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
      <TreePageHeader>
        <div>{forestOwnerDisplayName}'s Forest</div>
        <PlantNewTreeButton />
      </TreePageHeader>
      <GridWrapper>
        {treeData?.map((techtreeData, index) => {
          if (techtreeData) {
            const parsedNodeList = JSON.parse(techtreeData.nodeList)
            const parsedLinkList = JSON.parse(techtreeData.linkList)
            return (
              <TechtreeThumbnail
                nodeList={parsedNodeList}
                linkList={parsedLinkList}
                techtreeTitle={techtreeData?.title}
                techtreeID={techtreeData?._id}
                techtreeData={techtreeData}
                key={index}
              />
            )
          }
        })}
      </GridWrapper>
    </MainWrapper>
  )
}
