import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import MainWrapper from '../../wrappers/MainWrapper'
import TechtreeThumbnail, {
  TechtreeInfo,
  TechtreeThumbnailBlock,
} from '../../components/TechtreeThumbnail'
import { TechtreeThumbnailCard } from '../../components/TechtreeThumbnail'
import { Spinner } from '../../components/Spinner'
import TreeIcon from '../../assets/tree.svg'

import styled from 'styled-components'

import { authService } from '../../lib/firebase'
import axios from 'axios'
import { uid } from 'uid'
import { CreateTechtree, readTechtreeList } from '../../redux/techtree'
import { useDispatch, useSelector } from 'react-redux'
import { colorPalette, boxShadow } from '../../lib/constants'

export default function TechtreeListPage() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { techtreeList } = useSelector((state) => {
    return { techtreeList: state.techtree.techtreeList }
  })
  const { loading } = useSelector((state) => {
    return { loading: state.techtree.loading }
  })
  const { loginState, userID } = useSelector((state) => {
    return { loginState: state.auth.loginState, userID: state.auth.userID }
  })

  useEffect(() => {
    dispatch(readTechtreeList())
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
      <GridContainer>
        {/* 링크를 누른순간, 서버에 테크트리가 생성되고, 생성되고 나서 그 테크트리를 불러오는 식으로 하는게 나을듯.*/}

        <TechtreeThumbnailCard
          onClick={() => {
            if (loginState) {
              dispatch(CreateTechtree())
            } else {
              alert('로그인이 필요해요')
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <TechtreeThumbnailBlock>
            <img src={TreeIcon} alt="treeIcon" width="250px" height="250px" />
          </TechtreeThumbnailBlock>
          <TechtreeInfo>
            <div style={{ margin: 'auto' }}> 새로운 테크트리 심기</div>
          </TechtreeInfo>
        </TechtreeThumbnailCard>

        {techtreeList.map((techtreeData, index) => {
          return (
            <TechtreeThumbnail
              nodeList={techtreeData.nodeList}
              linkList={techtreeData.linkList}
              techtreeTitle={techtreeData.title}
              techtreeID={techtreeData._id}
              techtreeData={techtreeData}
              key={index}
            />
          )
        })}
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
const CreateNewTechtree = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  border-radius: 2px;
  width: 300px;
  height: 300px;
  cursor: pointer;
  box-shadow: ${boxShadow.default};
  text-align: center;
  background-color: #ffffff;
`
