import React, { useEffect } from 'react'

import MainWrapper from '../../wrappers/MainWrapper'
import TechtreeThumbnail from '../../components/TechtreeThumbnail'
import PlantNewTreeCard from '../../components/PlantNewTreeCard'
import { TreePageHeader } from './TechtreeDetailPage'
import { Spinner } from '../../components/Spinner'

import { GridWrapper } from '../../wrappers/GridWrapper'
import PageButtons from '../../components/PageButtons'

import styled from 'styled-components'

import { readTechtreeList } from '../../redux/techtree'
import { useDispatch, useSelector } from 'react-redux'

import queryString from 'query-string'

export default function TechtreeListPage({ match, location }) {
  const dispatch = useDispatch()
  const { techtreeList } = useSelector((state) => {
    return { techtreeList: state.techtree.techtreeList }
  })
  const { loading, treeSum } = useSelector((state) => {
    return { loading: state.techtree.loading, treeSum: state.techtree.treeSum }
  })

  const pageNumber = queryString.parse(location.search).page

  useEffect(() => {
    dispatch(readTechtreeList(pageNumber))
  }, [dispatch, pageNumber])

  if (loading) {
    return (
      <MainWrapper>
        <Spinner />
      </MainWrapper>
    )
  }

  return (
    <MainWrapper>
      <TreePageHeader>모두의 Forest</TreePageHeader>
      <GridWrapper>
        {pageNumber == 1 ? <PlantNewTreeCard /> : ''}

        {techtreeList?.map((techtreeData, index) => {
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
      </GridWrapper>
      <PageButtonArea>
        <PageButtonContainer>
          <PageButtons
            pageNumber={pageNumber}
            treePerPage={20}
            postSum={treeSum}
            routingString={`forest`}
          />
        </PageButtonContainer>
      </PageButtonArea>
    </MainWrapper>
  )
}

const PageButtonContainer = styled.div`
  display: flex;
`

const PageButtonArea = styled.div`
  width: 90%;
  display: grid;
  justify-items: center;
  padding: 1rem;
`
