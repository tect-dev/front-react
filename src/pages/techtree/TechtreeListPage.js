import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainWrapper from '../../wrappers/MainWrapper'
import TechtreeThumbnail from '../../components/TechtreeThumbnail'
import styled from 'styled-components'

import { readTechtreeList } from '../../redux/techtree'
import { sortISOByTimeStamp } from '../../lib/functions'
//import { dummyTechtreeDataList } from '../../lib/dummyData'
import { useDispatch, useSelector } from 'react-redux'

export default function TechtreeListPage() {
  const dispatch = useDispatch()
  const { techtreeList } = useSelector((state) => {
    return { techtreeList: state.techtree.techtreeList }
  })

  useEffect(() => {
    dispatch(readTechtreeList())
  }, [dispatch])

  return (
    <MainWrapper>
      <GridContainer>
        <Link to={`/techtree/write`}>
          <div>새로운 테크트리 심기</div>
        </Link>
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
