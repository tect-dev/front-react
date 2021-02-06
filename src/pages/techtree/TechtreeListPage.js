import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainWrapper from '../../wrappers/MainWrapper'
import TechtreeThumbnail from '../../components/TechtreeThumbnail'
import styled from 'styled-components'

import { authService } from '../../lib/firebase'
import axios from 'axios'
import { uid } from 'uid'
import { readTechtreeList } from '../../redux/techtree'
import { useDispatch, useSelector } from 'react-redux'
import { colorPalette } from '../../lib/constants'

const CreateNewTechtree = styled.div`
  border-radius: 1px;
  border: 1px solid ${colorPalette.cyan5};
`

export default function TechtreeListPage() {
  const dispatch = useDispatch()
  const { techtreeList } = useSelector((state) => {
    return { techtreeList: state.techtree.techtreeList }
  })
  const { loginState, userID } = useSelector((state) => {
    return { loginState: state.auth.loginState, userID: state.auth.userID }
  })

  useEffect(() => {
    dispatch(readTechtreeList())
  }, [dispatch])

  return (
    <MainWrapper>
      <GridContainer>
        {/* 링크를 누른순간, 서버에 테크트리가 생성되고, 생성되고 나서 그 테크트리를 불러오는 식으로 하는게 나을듯.*/}

        <CreateNewTechtree
          onClick={() => {
            if (loginState) {
              authService.currentUser.getIdToken(true).then(async (idToken) => {
                const techtreeID = uid(24)
                axios({
                  method: 'post',
                  url: `${process.env.REACT_APP_BACKEND_URL}/techtree`,
                  headers: { 'Content-Type': 'application/json' },
                  data: {
                    title: '새로운 테크트리',
                    _id: techtreeID,
                    hashtags: [],
                    nodeList: [],
                    linkList: [],
                    firebaseToken: idToken,
                  },
                })
              })
            } else {
              alert('로그인이 필요해요')
            }
            // uid24 에 해당하는 테크트리 생성. 그 다음에
          }}
        >
          새로운 테크트리 심기
        </CreateNewTechtree>

        {techtreeList.map((techtreeData, index) => {
          return (
            <TechtreeThumbnail
              nodeList={techtreeData.nodeList}
              linkList={techtreeData.linkList}
              techtreeTitle={techtreeData.title}
              techtreeID={techtreeData._id}
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
  align-items: center; // 세로축에서 중앙정렬
  justify-items: center; // 가로축에서 중앙정렬
  width: 'auto';
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
