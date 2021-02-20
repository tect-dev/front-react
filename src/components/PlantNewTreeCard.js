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

const PlantNewTree = () => {
  const dispatch = useDispatch()
  const { loginState } = useSelector((state) => {
    return { loginState: state.auth.loginState }
  })
  return (
    <>
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
        <TreeThumbnailHeader>
          <StyledTitle>새 나무 심기</StyledTitle>
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
