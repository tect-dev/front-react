import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import MainWrapper from '../../wrappers/MainWrapper'
import TechtreeThumbnail, {
  TechtreeThumbnailCard,
  TechtreeInfo,
  TechtreeThumbnailBlock,
  TechtreeThumbnailImage,
  TreeThumbnailHeader,
} from '../../components/TechtreeThumbnail'
import { TreePageHeader } from './TechtreeDetailPage'
import { Spinner } from '../../components/Spinner'
import { Button, DefaultButton } from '../../components/Button'
import { StyledTitle } from '../../components/TitleInput'
import TreeIcon from '../../assets/tree.svg'
import { GridWrapper } from '../../wrappers/GridWrapper'

import styled from 'styled-components'

import { authService } from '../../lib/firebase'
import axios from 'axios'
import { uid } from 'uid'
import { createTechtree, readTechtreeList } from '../../redux/techtree'
import { useDispatch, useSelector } from 'react-redux'
import { colorPalette, boxShadow } from '../../lib/constants'

export default function TechtreeListPage() {
  const dispatch = useDispatch()

  const { techtreeList } = useSelector((state) => {
    return { techtreeList: state.techtree.techtreeList }
  })
  const { loading, treeSum } = useSelector((state) => {
    return { loading: state.techtree.loading, treeSum: state.techtree.treeSum }
  })

  const { loginState, userID } = useSelector((state) => {
    return { loginState: state.auth.loginState, userID: state.auth.userID }
  })
  const [pageNumber, setPageNumber] = useState(1)
  const treePerPage = 20
  const pageMaxNumber = Math.floor(treeSum / treePerPage) + 1
  const pageArray = []
  for (let i = 0; i < pageMaxNumber; i++) {
    pageArray.push(i + 1)
  }

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
        {pageNumber === 1 ? (
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
              <TechtreeThumbnailImage src={TreeIcon} alt="treeIcon" />
            </TechtreeThumbnailBlock>
            <TechtreeInfo></TechtreeInfo>
          </TechtreeThumbnailCard>
        ) : (
          ''
        )}

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
          {pageArray.map((ele, idx) => {
            // 1번이랑 마지막은 무조건 렌더링을 해야함.
            // 최소 5개는 렌더링 해야함.
            // pageNumber -2, -1, 0 , +1, +2 를 렌더링하고 +3에선 ...을 반환하고 이후 마지막것만 렌더링.
            // 그러나 pageNumber 가 3보다 작다면 1~5를 렌더링한다.

            if (ele === 1) {
              if (pageNumber === ele) {
                return (
                  <SelectedButton
                    key={idx}
                    onClick={() => {
                      setPageNumber(ele)
                    }}
                  >
                    {ele}
                  </SelectedButton>
                )
              } else {
                return (
                  <DefaultButton
                    key={idx}
                    onClick={() => {
                      setPageNumber(ele)
                    }}
                  >
                    {ele}
                  </DefaultButton>
                )
              }
            }

            if (ele === pageMaxNumber) {
              if (pageNumber === ele) {
                return (
                  <SelectedButton
                    key={idx}
                    onClick={() => {
                      setPageNumber(ele)
                    }}
                  >
                    {ele}
                  </SelectedButton>
                )
              } else {
                return (
                  <DefaultButton
                    key={idx}
                    onClick={() => {
                      setPageNumber(ele)
                    }}
                  >
                    {ele}
                  </DefaultButton>
                )
              }
            }

            if (ele === pageNumber) {
              return (
                <SelectedButton
                  key={idx}
                  onClick={() => {
                    setPageNumber(ele)
                  }}
                >
                  {ele}
                </SelectedButton>
              )
            } else if (ele < pageNumber + 3 && ele > pageNumber - 3) {
              return (
                <DefaultButton
                  key={idx}
                  onClick={() => {
                    setPageNumber(ele)
                  }}
                >
                  {ele}
                </DefaultButton>
              )
            } else if (ele === pageNumber + 3) {
              return <>...</>
            } else if (ele === pageNumber - 3) {
              return <>...</>
            } else {
              return
            }
          })}
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

const SelectedButton = styled(DefaultButton)`
  background-color: ${colorPalette.mainGreen};
`
