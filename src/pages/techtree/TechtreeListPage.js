import React, { useEffect, useState } from 'react'
import MainWrapper from '../../wrappers/MainWrapper'
import TechtreeThumbnail from '../../components/TechtreeThumbnail'
import styled from 'styled-components'
import { dummyTechtreeDataList } from '../../lib/dummyData'

export default function TechtreeListPage() {
  const [techtreeDataList, setTechtreeDataList] = useState([])

  useEffect(() => {
    setTechtreeDataList(dummyTechtreeDataList)
  }, [techtreeDataList])

  return (
    <MainWrapper>
      <GridContainer>
        <div>새로운 테크트리 심기</div>
        {techtreeDataList.map((techtreeData, index) => {
          return (
            <TechtreeThumbnail
              nodeList={techtreeData.nodeList}
              linkList={techtreeData.linkList}
              techtreeTitle={techtreeData.title}
              techtreeID={techtreeData.id}
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
