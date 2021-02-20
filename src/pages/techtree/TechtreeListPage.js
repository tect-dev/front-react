import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import MainWrapper from '../../wrappers/MainWrapper'
import TechtreeThumbnail from '../../components/TechtreeThumbnail'
import PlantNewTreeCard from '../../components/PlantNewTreeCard'
import { TreePageHeader } from './TechtreeDetailPage'
import { Spinner } from '../../components/Spinner'
import { Button, DefaultButton } from '../../components/Button'
import { StyledTitle } from '../../components/TitleInput'
import TreeIcon from '../../assets/tree.svg'
import MainIcon from '../../assets/MainIcon.png'
import { GridWrapper } from '../../wrappers/GridWrapper'
import PageButtons from '../../components/PageButtons'

import styled from 'styled-components'

import { authService } from '../../lib/firebase'
import axios from 'axios'
import { uid } from 'uid'
import { createTechtree, readTechtreeList } from '../../redux/techtree'
import { useDispatch, useSelector } from 'react-redux'
import { colorPalette, boxShadow } from '../../lib/constants'
import queryString from 'query-string'

export default function TechtreeListPage({ match, location }) {
  const dispatch = useDispatch()
  //const routingString = location.pathname.split('/')[2].split('?')[0]
  const { techtreeList } = useSelector((state) => {
    return { techtreeList: state.techtree.techtreeList }
  })
  const { loading, treeSum } = useSelector((state) => {
    return { loading: state.techtree.loading, treeSum: state.techtree.treeSum }
  })

  const { loginState, userID } = useSelector((state) => {
    return { loginState: state.auth.loginState, userID: state.auth.userID }
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
        {pageNumber === 1 ? <PlantNewTreeCard /> : ''}

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
