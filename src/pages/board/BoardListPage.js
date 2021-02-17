import { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MainLayout from '../../components/layout/MainLayout'
import MainWrapper from '../../wrappers/MainWrapper'
import { readQuestionList, readHashtagResults } from '../../redux/readPost'
import { Link } from 'react-router-dom'

import { Spinner } from '../../components/Spinner'
import { DefaultButton } from '../../components/Button'

// import { Button } from '../../components/Button'
import { Pagination } from '../../components/Pagination'

import '../../styles/page/question/QuestionListPage.scss'
import styled from 'styled-components'
import {
  colorPalette,
  boxShadow,
  hoverAction,
  fontSize,
} from '../../lib/constants'

import ErrorPage from '../../components/layout/ErrorPage'
import NoDataPage from '../../components/layout/NoDataPage'

import { readPostList } from '../../redux/board'
import { setUserPlace } from '../../redux/auth'

export default function QuestionListPage({ match }) {
  const { category } = match.params
  const dispatch = useDispatch()
  const { postList, loading, error, postSum } = useSelector((state) => {
    return {
      postList: state.board.postList,
      loading: state.board.loading,
      error: state.board.error,
      postSum: state.board.postSum,
    }
  })
  const { loginState } = useSelector((state) => {
    return { loginState: state.auth.loginState }
  })
  const postPerPage = 10
  const pageMaxNumber = Math.floor(postSum / postPerPage) + 1
  const pageArray = []
  for (let i = 0; i < pageMaxNumber; i++) {
    pageArray.push(i + 1)
  }

  const [pageNumber, setPageNumber] = useState(1)

  useEffect(() => {
    dispatch(setUserPlace(category))
    dispatch(readPostList(category, pageNumber))
  }, [pageNumber])

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
          <BoardListHeader>
            <Category>{category === 'main' ? '전체' : category}</Category>
            <Buttons>
              <Button2>
                {' '}
                <span>인기순</span>{' '}
              </Button2>
              <Button2>
                {' '}
                <span>최신순</span>{' '}
              </Button2>
              <Button>
                {loginState ? (
                  <Link to={`/write/${category}`}>새 글 쓰기</Link>
                ) : (
                  ''
                )}
              </Button>
            </Buttons>
          </BoardListHeader>

          {postList.map((postData, idx) => {
            return (
              <Link to={`/post/${postData._id}`} key={idx}>
                <PostCard>
                  <Title>{postData.title}</Title>
                  <ContentSubstring>
                    {postData.contentSubstring}
                  </ContentSubstring>
                  {/* <div>{postData.createdAt}</div> */}
                  <LikeComment>
                    <div style={{ marginRight: '10px' }}>
                      좋아요 {postData.like}
                    </div>
                    <div>댓글 {postData.answerSum}</div>
                  </LikeComment>
                  {/* <div>{postData.author[0]?.displayName}</div>
                  <div>{postData.hashtags[0]}</div> */}
                </PostCard>
              </Link>
            )
          })}
        </BoardListWrapper>
        {/* <BoardSideBarWrapper>
          <CategoryCard>{category}</CategoryCard>
          <TrendingListCard>
            <div>다른게시판 링크</div>
            <div>또는 트렌딩 게시글 링크</div>
          </TrendingListCard>
        </BoardSideBarWrapper> */}
      </TwoOneMainWapper>
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

export const TwoOneMainWapper = styled.div`
  width: inherit;
  display: grid;
  grid-template-columns: 1fr;
  /* grid-template-columns: 2fr 1fr; */
  @media (max-width: 1440px) {
    /* grid-template-columns: 2fr 1fr; */
  }
  @media (max-width: 1024px) {
    /* grid-template-columns: 2fr 1fr; */
  }
  @media (max-width: 650px) {
    /* grid-template-columns: 1fr; */
  }
`
export const BoardListWrapper = styled.div`
  width: inherit;
  display: grid;
  grid-row-gap: 25px;
  /* border: 1px solid 'black'; */
`

export const BoardSideBarWrapper = styled.div`
  display: grid;
  grid-row-gap: 25px;
`

export const Buttons = styled.div`
  height: 30px;
  display: flex;
  justify-content: flex-end;
`

export const Button = styled.button`
  cursor: pointer;
  height: initial;
  background: none;
  border: none;
  margin-left: 17px;
  & a {
    width: 100px;
    height: 30px;
    padding: 6px 14px 5px 14px;
    border-radius: 13px;
    background: #6d9b7b;
    color: white;
    font-weight: bold;
    font-size: ${fontSize.small};
  }
`

export const Button2 = styled(Button)`
  display: flex;
  color: #707070;
  & span {
    align-self: flex-end;
    margin-bottom: 2px;
  }
`

export const Category = styled.div`
  font-size: ${fontSize.xlarge};
  color: #707070;
  font-weight: bold;
`

export const BoardListHeader = styled.div`
  width: inherit;
  padding-left: 10px;
`

export const Title = styled.div`
  font-size: ${fontSize.small};
  color: #6d9b7b;
  font-weight: bold;
  margin-bottom: 17px;
`

export const ContentSubstring = styled.div`
  font-size: ${fontSize.small};
  color: #999;
  margin-bottom: 22px;
`

export const LikeComment = styled.div`
  display: flex;
  font-size: ${fontSize.small};
  color: #999;
  justify-content: flex-end;
`

export const PostCard = styled.div`
  padding: 22px;
  box-sizing: border-box;
  background: #fffef8;
  width: 100%;
  height: 140px;
  border-radius: 22px;
  cursor: pointer;

  background-color: #fffef8;
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
