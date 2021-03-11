import {
  TechtreeThumbnailCard,
  TreeThumbnailHeader,
  TechtreeThumbnailBlock,
  TechtreeThumbnailImage,
  TechtreeInfo,
} from './TechtreeThumbnail'
import { StyledTitle } from './TitleInput'
import MainIcon from '../assets/MainIcon.png'

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createTechtree } from '../redux/techtree'
import { authService } from '../lib/firebase'
import { DefaultButton } from '../components/Button'

export const PlantNewTreeButton = () => {
  const dispatch = useDispatch()
  const { loginState, userInfo } = useSelector((state) => {
    return {
      loginState: state.auth.loginState,
      userInfo: {
        firebaseUid: state.auth.userID,
        displayName: state.auth.userNickname,
      },
    }
  })
  return (
    <>
      <DefaultButton
        onClick={() => {
          if (loginState) {
            //&& authService.currentUser.emailVerified) {
            dispatch(createTechtree(userInfo))
            //} else if (loginState && !authService.currentUser.emailVerified) {
            //  alert('Please finish email verification!')
          } else {
            alert('Login is required!')
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        Plant New Tree
      </DefaultButton>
    </>
  )
}

const PlantNewTree = () => {
  const dispatch = useDispatch()
  const { loginState, userInfo } = useSelector((state) => {
    return {
      loginState: state.auth.loginState,
      userInfo: {
        firebaseUid: state.auth.userID,
        displayName: state.auth.userNickname,
      },
    }
  })
  return (
    <>
      <TechtreeThumbnailCard
        onClick={() => {
          if (loginState && authService.currentUser.emailVerified) {
            dispatch(createTechtree(userInfo))
          } else if (loginState && !authService.currentUser.emailVerified) {
            alert('Please finish email verification!')
          } else {
            alert('Login is required!')
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <TreeThumbnailHeader>
          <StyledTitle>Plant New Tree!</StyledTitle>
        </TreeThumbnailHeader>
        <TechtreeThumbnailBlock>
          <TechtreeThumbnailImage
            src={MainIcon}
            alt="treeIcon"
            //style={{ width: '70%' }}
          />
        </TechtreeThumbnailBlock>
        <TechtreeInfo></TechtreeInfo>
      </TechtreeThumbnailCard>
    </>
  )
}

export default React.memo(PlantNewTree)
