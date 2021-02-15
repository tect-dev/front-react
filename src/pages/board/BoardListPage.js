import { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MainLayout from '../../components/layout/MainLayout'
import MainWrapper from '../../wrappers/MainWrapper'
import { readQuestionList, readHashtagResults } from '../../redux/readPost'
import { Link } from 'react-router-dom'

import { Spinner } from '../../components/Spinner'

import { Button } from '../../components/Button'
import { Pagination } from '../../components/Pagination'

import '../../styles/page/question/QuestionListPage.scss'
import styled from 'styled-components'
import { colorPalette, boxShadow, hoverAction } from '../../lib/constants'

import ErrorPage from '../../components/layout/ErrorPage'
import NoDataPage from '../../components/layout/NoDataPage'

import { readPostList } from '../../redux/board'
import { setUserPlace } from '../../redux/auth'

export default function QuestionListPage({ match }) {
  const { category } = match.params

  const { postList, loading, error } = useSelector((state) => {
    return {
      postList: state.board.postList,
      loading: state.board.loading,
      error: state.board.error,
    }
  })

  const { loginState } = useSelector((state) => {
    return { loginState: state.auth.loginState }
  })

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setUserPlace(category))
    dispatch(readPostList(category))
  }, [])

  if (loading)
    return (
      <MainWrapper>
        <Spinner />
      </MainWrapper>
    )
  if (error) return <ErrorPage>{error.toString()}</ErrorPage>

  return (
    <MainWrapper>
      <TwoOneMainWapper>
        <BoardListWrapper>
          {loginState ? (
            <Link to={`/write/${category}`}>새글 작성하기</Link>
          ) : (
            ''
          )}

          <div>최신순 정렬 또는 트렌딩 정렬 버튼</div>
          {postList.map((postData) => {
            return (
              <Link to={`/post/${postData._id}`}>
                <PostCard>
                  <div>{postData.title}</div>
                  <div>{postData.contentSubstring}</div>
                  <div>{postData.createdAt}</div>
                  <div>좋아요: {postData.like}</div>
                  <div>답변갯수: {postData.answerSum}</div>
                  <div>{postData.author[0]?.displayName}</div>
                </PostCard>
              </Link>
            )
          })}
        </BoardListWrapper>
        <BoardSideBarWrapper>
          <CategoryCard>테스트페이지 카테고리카드</CategoryCard>
          <TrendingListCard>
            <div>다른게시판 링크</div>
            <div>또는 트렌딩 게시글 링크</div>
          </TrendingListCard>
        </BoardSideBarWrapper>
      </TwoOneMainWapper>
    </MainWrapper>
  )
}

export const TwoOneMainWapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  @media (max-width: 1440px) {
    grid-template-columns: 2fr 1fr;
  }
  @media (max-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`
export const BoardListWrapper = styled.div`
  display: grid;
  grid-row-gap: 25px;
  border: 1px solid 'black';
  color: 'red'; // 디버깅을 위한 임시
`

export const BoardSideBarWrapper = styled.div`
  display: grid;
  grid-row-gap: 25px;
  color: 'red'; // 디버깅을 위한 임시
`

export const PostCard = styled.div`
  padding: 25px;
  width: 80%;
  cursor: pointer;

  background-color: #ffffff;
  box-shadow: ${boxShadow.default};

  transition: 0.25s box-shadow ease-in, 0.25s transform ease-in;
  &:hover {
    ${hoverAction}
  }
`
export const CategoryCard = styled.div`
  padding: 25px;
  width: 80%;

  background-color: #ffffff;
  box-shadow: ${boxShadow.default};
`
export const TrendingListCard = styled.div`
  padding: 25px;
  width: 80%;

  background-color: #ffffff;
  box-shadow: ${boxShadow.default};
`
