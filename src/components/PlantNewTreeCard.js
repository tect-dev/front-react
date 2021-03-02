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

const PlantNewTree = () => {
  const dispatch = useDispatch()
  const { loginState, emailVerified, userInfo } = useSelector((state) => {
    return {
      loginState: state.auth.loginState,
      emailVerified: state.auth.emailVerified,
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
            alert('이메일 인증을 마무리 해주세요!')
          } else {
            alert('로그인이 필요해요')
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
